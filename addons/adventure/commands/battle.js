/**
 * @namespace: addons/adventure/commands/battle.js
 * @type: Command
 * @copyright © 2025 kenndeclouv
 * @assistant chaa & graa
 * @version 0.9.10-beta
 */
const { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, PermissionFlagsBits } = require('discord.js');
const UserAdventure = require('../database/models/UserAdventure');
const InventoryAdventure = require('../database/models/InventoryAdventure');
const CharManager = require('../helpers/charManager');
const { getRandomMonster } = require('../helpers/monster');
const { embedFooter } = require('@coreHelpers/discord');
const { t } = require('@coreHelpers/translator');

module.exports = {
    subcommand: true,
    data: (subcommand) =>
        subcommand
            .setName('battle')
            .setNameLocalizations({ id: 'bertarung', fr: 'combat', ja: 'たたかう' })
            .setDescription('⚔️ Fight a monster in the dungeon!')
            .setDescriptionLocalizations({
                id: '⚔️ Bertarung melawan monster di dimensi lain!',
                fr: '⚔️ Combats un monstre dans le donjon !',
                ja: '⚔️ ダンジョンでモンスターと戦おう！',
            }),
    // permissions: PermissionFlagsBits.ManageGuild,
    async execute(interaction, container) {
        await interaction.deferReply();
        const user = await UserAdventure.getCache({ userId: interaction.user.id });
        const userId = interaction.user.id;
        if (!user) {
            const embed = new EmbedBuilder()
                .setColor('Red')
                .setDescription(await t(interaction, 'adventure.no.character'))
                .setFooter(await embedFooter(interaction));
            return interaction.editReply({ embeds: [embed] });
        }

        // Progress bar generator
        const generateHpBar = (currentHp, maxHp, barLength = 20) => {
            const hpPercent = Math.max(0, Math.min(1, currentHp / maxHp));
            const filledLength = Math.round(barLength * hpPercent);
            return `[${'█'.repeat(filledLength)}${'░'.repeat(barLength - filledLength)}] ${currentHp} HP`;
        };

        // Function to handle a single round of battle and return the result
        const handleBattleRound = async (interaction, user, items) => {
            const sword = items.find((item) => item?.itemName === '⚔️ Sword');
            const shield = items.find((item) => item?.itemName === '🛡️ Shield');
            const armor = items.find((item) => item?.itemName === '🥋 Armor');
            const revival = items.find((item) => item?.itemName === '🍶 Revival');

            let userStrength = user.strength + (sword ? 10 : 0);
            let userDefense = user.defense + (shield ? 10 : 0) + (armor ? 15 : 0);

            // Apply character passive bonuses per turn (xp/gold modifiers on outcomes below)
            const char = user.characterId ? CharManager.getChar(user.characterId) : null;

            const playerDamage = Math.max(1, userStrength + Math.floor(Math.random() * 4));
            let monsterRaw = user.monsterStrength - userDefense;
            const monsterDamage = Math.max(1, monsterRaw + Math.floor(Math.random() * 4));

            const monsterMaxHp = user.monsterHp > 0 ? user.monsterHp + playerDamage : 1;

            user.hp = Math.max(0, user.hp - monsterDamage);
            user.monsterHp = Math.max(0, user.monsterHp - playerDamage);
            await user.saveAndUpdateCache();

            const embed = new EmbedBuilder().setThumbnail(interaction.user.displayAvatarURL({ dynamic: true }));

            // Buttons for battle actions
            const battleButtons = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setCustomId('adventure_continue')
                    .setLabel(await t(interaction, 'adventure.battle.continue.button'))
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId('adventure_use_item')
                    .setLabel(await t(interaction, 'inventory.use.item.button'))
                    .setStyle(ButtonStyle.Secondary)
                    .setEmoji('🔮')
            );

            // Check if player has any usable items
            const usableItems = await InventoryAdventure.findAll({
                where: {
                    userId: interaction.user.id,
                    itemName: ['🍶 Health Potion', '🍶 Revival'],
                },
                raw: true,
            });

            // Disable Use Item button if no usable items
            if (usableItems.length === 0) {
                battleButtons.components[1].setDisabled(true);
            }

            // Continue Button (defined here so available for returns)
            const continueButton = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setCustomId('adventure_continue')
                    .setLabel(await t(interaction, 'adventure.battle.continue.button'))
                    .setStyle(ButtonStyle.Primary)
            );

            // Kalau user kalah
            if (user.hp <= 0) {
                if (revival) {
                    user.hp = user.maxHp;
                    await user.saveAndUpdateCache();
                    await revival.destroy();
                    await InventoryAdventure.clearCache({ userId: user.userId, itemName: '🍶 Revival' });
                    return {
                        embeds: [
                            embed
                                .setDescription(
                                    await t(interaction, 'adventure.battle.revive', {
                                        hp: user.hp,
                                    })
                                )
                                .setColor(kythia.bot.color)
                                .setFooter(await embedFooter(interaction)),
                        ],
                        components: [continueButton],
                        end: false,
                    };
                }

                // Kalah tanpa revival: reset HP, hapus monster
                user.hp = user.maxHp;
                user.monsterName = null;
                user.monsterHp = 0;
                user.monsterStrength = 0;
                user.monsterGoldDrop = 0;
                user.monsterXpDrop = 0;
                await user.saveAndUpdateCache();
                return {
                    embeds: [
                        embed
                            .setDescription(
                                await t(interaction, 'adventure.battle.lose', {
                                    hp: user.hp,
                                })
                            )
                            .setColor('Red')
                            .setFooter(await embedFooter(interaction)),
                    ],
                    components: [continueButton],
                    end: true,
                };
            }

            // Kalau monster mati
            if (user.monsterHp <= 0) {
                let goldEarned = user.monsterGoldDrop;
                let xpEarned = user.monsterXpDrop;
                if (char) {
                    if (char.goldBonusPercent) goldEarned = Math.floor(goldEarned * (1 + char.goldBonusPercent / 100));
                    if (char.xpBonusPercent) xpEarned = Math.floor(xpEarned * (1 + char.xpBonusPercent / 100));
                }
                const monsterName = user.monsterName;

                user.xp += xpEarned;
                user.gold += goldEarned;

                // Reset monster
                user.monsterName = null;
                user.monsterHp = 0;
                user.monsterStrength = 0;
                user.monsterGoldDrop = 0;
                user.monsterXpDrop = 0;

                // XP required for next level (sederhanakan, misal: 100 * level)
                const XP_REQUIRED = 100 * user.level;
                let levelUp = false;
                // For tracking previous maxHp to report/display etc if needed
                while (user.xp >= XP_REQUIRED) {
                    user.xp -= XP_REQUIRED;
                    user.level++;
                    user.strength += 5;
                    user.defense += 3;

                    // Before leveling up, increase maxHp by 10%
                    user.maxHp = Math.ceil(user.maxHp * 1.1);

                    // Set new current HP to new max
                    user.hp = user.maxHp;
                    levelUp = true;
                }

                await user.saveAndUpdateCache();

                if (levelUp) {
                    return {
                        embeds: [
                            embed
                                .setDescription(
                                    await t(interaction, 'adventure.battle.levelup', {
                                        level: user.level,
                                        hp: user.hp,
                                        maxHp: user.maxHp,
                                    })
                                )
                                .setColor(kythia.bot.color)
                                .setFooter(await embedFooter(interaction)),
                        ],
                        components: [continueButton],
                        end: true,
                    };
                }

                return {
                    embeds: [
                        embed
                            .setDescription(
                                await t(interaction, 'adventure.battle.win', {
                                    monster: monsterName,
                                    gold: goldEarned,
                                    xp: xpEarned,
                                })
                            )
                            .setColor(kythia.bot.color)
                            .setFooter(await embedFooter(interaction)),
                    ],
                    components: [continueButton],
                    end: true,
                };
            }

            // Battle masih lanjut
            return {
                embeds: [
                    embed
                        .setDescription(
                            await t(interaction, 'adventure.battle.round', {
                                user: interaction.user.username,
                                monster: user.monsterName,
                                playerDamage,
                                monsterDamage,
                            })
                        )
                        .setColor(kythia.bot.color)
                        .addFields(
                            {
                                name: await t(interaction, 'adventure.battle.hp.you'),
                                value: generateHpBar(user.hp, user.maxHp),
                                inline: false,
                            },
                            {
                                name: await t(interaction, 'adventure.battle.hp.monster', { monster: user.monsterName }),
                                value: generateHpBar(user.monsterHp, monsterMaxHp),
                                inline: false,
                            }
                        )
                        .setFooter(await embedFooter(interaction)),
                ],
                components: [battleButtons],
                end: false,
            };
        };

        // Jika monster belum ada, buat monster baru
        if (!user.monsterName) {
            const monster = getRandomMonster(user.level);
            user.monsterName = monster.name;
            user.monsterHp = monster.hp;
            user.monsterStrength = monster.strength;
            user.monsterGoldDrop = monster.goldDrop;
            user.monsterXpDrop = monster.xpDrop;
            await user.saveAndUpdateCache();
        }

        const items = await InventoryAdventure.getCache([
            { userId: userId, itemName: '⚔️ Sword' },
            { userId: userId, itemName: '🛡️ Shield' },
            { userId: userId, itemName: '🥋 Armor' },
            { userId: userId, itemName: '🍶 Revival' },
        ]);

        // First round
        const result = await handleBattleRound(interaction, user, items);

        // Send the initial reply and set up the collector
        const reply = await interaction.editReply({
            embeds: result.embeds,
            components: result.components,
            fetchReply: true,
        });

        // If the battle ended (user lost or monster died), don't set up a collector
        if (result.end) return;

        // Set up a collector for the continue button
        const filter = (i) => i.customId === 'adventure_continue' && i.user.id === interaction.user.id;
        const collector = reply.createMessageComponentCollector({ filter, time: 60_000 });

        collector.on('collect', async (i) => {
            await i.deferUpdate();

            // Re-fetch user and items for up-to-date stats
            const freshUser = await UserAdventure.getCache({ userId });
            const freshItems = await InventoryAdventure.getCache([
                { userId: userId, itemName: '⚔️ Sword' },
                { userId: userId, itemName: '🛡️ Shield' },
                { userId: userId, itemName: '🥋 Armor' },
                { userId: userId, itemName: '🍶 Revival' },
            ]);

            const nextResult = await handleBattleRound(i, freshUser, freshItems);

            await interaction.editReply({
                embeds: nextResult.embeds,
                components: nextResult.end ? [] : nextResult.components,
            });

            if (nextResult.end) collector.stop('battle_end');
        });

        collector.on('end', async (_, reason) => {
            if (reason !== 'battle_end') {
                // Disable the button if time runs out
                const disabledRow = new ActionRowBuilder().addComponents(
                    new ButtonBuilder()
                        .setCustomId('adventure_continue')
                        .setLabel(await t(interaction, 'adventure.battle.continue.button'))
                        .setStyle(ButtonStyle.Primary)
                        .setDisabled(true)
                );
                await interaction.editReply({
                    components: [disabledRow],
                });
            }
        });

        return;
    },
};
