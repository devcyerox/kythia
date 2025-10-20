/**
 * @namespace: addons/adventure/commands/start.js
 * @type: Command
 * @copyright © 2025 kenndeclouv
 * @assistant chaa & graa
 * @version 0.9.9-beta-rc.4
 */
const { EmbedBuilder } = require('discord.js');
const User = require('../database/models/UserAdventure');
const { embedFooter } = require('@utils/discord');
const { t } = require('@utils/translator');
const CharManager = require('../helpers/charManager');

module.exports = {
    subcommand: true,
    data: (subcommand) => {
        const chars = CharManager.getAllCharacters();
        return subcommand
            .setName('start')
            .setNameLocalizations({ id: 'mulai', fr: 'demarrer', ja: 'スタート' })
            .setDescription('🛩️ Start your journey now!')
            .setDescriptionLocalizations({
                id: '🛩️ Mulai petualanganmu sekarang!',
                fr: '🛩️ Commence ton aventure maintenant !',
                ja: '🛩️ 今すぐ冒険を始めよう！',
            })
            .addStringOption((option) =>
                option
                    .setName('character')
                    .setDescription('Choose your starting character!')
                    .setRequired(true)
                    .addChoices(
                        ...chars.map((char) => ({
                            name: `${char.emoji} ${char.name}`,
                            value: char.id,
                        }))
                    )
            );
    },
    async execute(interaction) {
        await interaction.deferReply();

        const existing = await User.getCache({ userId: interaction.user.id });

        if (existing) {
            const alreadyEmbed = new EmbedBuilder()
                .setColor(kythia.bot.color)
                .setDescription(await t(interaction, 'adventure_start_already_have'))
                .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true }))
                .setFooter(await embedFooter(interaction));
            return interaction.editReply({ embeds: [alreadyEmbed] });
        }

        const charId = interaction.options.getString('character');
        const selected = CharManager.getChar(charId);
        if (!selected) {
            const embed = new EmbedBuilder().setColor('Red').setDescription('Invalid character selection. Please try again.');
            return interaction.editReply({ embeds: [embed] });
        }

        // Base stats
        let level = 1;
        let xp = 0;
        let baseHp = 100;
        let gold = 50;
        let strength = 10;
        let defense = 5;

        // Apply character bonuses
        strength += selected.strengthBonus;
        defense += selected.defenseBonus;
        baseHp = Math.floor(baseHp * (1 + (selected.hpBonusPercent || 0) / 100));

        await User.create({
            userId: interaction.user.id,
            level,
            xp,
            hp: baseHp,
            gold,
            strength,
            defense,
            characterId: selected.id,
        });

        // Compose char bonus info for display
        const charStatsString = await t(interaction, 'adventure_start_choose_char_stats', {
            str: `${strength - selected.strengthBonus} (${selected.strengthBonus >= 0 ? '+' : ''}${selected.strengthBonus})`,
            def: `${defense - selected.defenseBonus} (${selected.defenseBonus >= 0 ? '+' : ''}${selected.defenseBonus})`,
            hp: `100% (${selected.hpBonusPercent >= 0 ? '+' : ''}${selected.hpBonusPercent}%)`,
            xp: `0% (${selected.xpBonusPercent >= 0 ? '+' : ''}${selected.xpBonusPercent}%)`,
            gold: `0% (${selected.goldBonusPercent >= 0 ? '+' : ''}${selected.goldBonusPercent}%)`,
        });

        const embed = new EmbedBuilder()
            .setColor(kythia.bot.color)
            .setTitle(await t(interaction, 'adventure_start_success_title'))
            .setDescription(
                [
                    await t(interaction, 'adventure_start_success_desc'),
                    '',
                    `**${await t(interaction, 'adventure_start_selected_char')}**`,
                    `${selected.emoji} ${selected.name}`,
                    selected.description,
                    charStatsString,
                ].join('\n')
            )
            .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true }))
            .setFooter(await embedFooter(interaction));
        return interaction.editReply({ embeds: [embed] });
    },
};
