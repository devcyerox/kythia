/**
 * @namespace: addons/economy/commands/transfer.js
 * @type: Command
 * @copyright © 2025 kenndeclouv
 * @assistant chaa & graa
 * @version 0.9.9-beta-rc.5
 */
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const KythiaUser = require('@coreModels/KythiaUser');
const { embedFooter } = require('@utils/discord');
const { t } = require('@utils/translator');
const BankManager = require('../helpers/bankManager');

module.exports = {
    subcommand: true,
    data: (subcommand) =>
        subcommand
            .setName('transfer')
            .setDescription('Transfer your money to another user.')
            .addUserOption((option) => option.setName('target').setDescription('User to transfer money to').setRequired(true))
            .addIntegerOption((option) => option.setName('amount').setDescription('Amount of money to transfer').setRequired(true)),
    async execute(interaction) {
        await interaction.deferReply();
        try {
            const target = interaction.options.getUser('target');
            const amount = interaction.options.getInteger('amount');

            const giver = await KythiaUser.getCache({ userId: interaction.user.id });
            const receiver = await KythiaUser.getCache({ userId: target.id });

            if (!giver) {
                const embed = new EmbedBuilder()
                    .setColor(kythia.bot.color)
                    .setDescription(await t(interaction, 'economy.withdraw.no.account.desc'))
                    .setThumbnail(interaction.user.displayAvatarURL())
                    .setTimestamp()
                    .setFooter(await embedFooter(interaction));
                return interaction.editReply({ embeds: [embed] });
            }

            if (giver.kythiaBank < amount) {
                const embed = new EmbedBuilder()
                    .setColor(kythia.bot.color)
                    .setDescription(await t(interaction, 'economy.transfer.transfer.not.enough.bank.text'))
                    .setThumbnail(interaction.user.displayAvatarURL())
                    .setTimestamp()
                    .setFooter(await embedFooter(interaction));
                return interaction.editReply({ embeds: [embed] });
            }
            if (!receiver) {
                const embed = new EmbedBuilder()
                    .setColor(kythia.bot.color)
                    .setDescription(await t(interaction, 'economy.transfer.transfer.target.no.account'))
                    .setThumbnail(interaction.user.displayAvatarURL())
                    .setTimestamp()
                    .setFooter(await embedFooter(interaction));
                return interaction.editReply({ embeds: [embed] });
            }
            if (giver.userId === receiver.userId) {
                const embed = new EmbedBuilder()
                    .setColor(kythia.bot.color)
                    .setDescription(await t(interaction, 'economy.transfer.transfer.self'))
                    .setThumbnail(interaction.user.displayAvatarURL())
                    .setTimestamp()
                    .setFooter(await embedFooter(interaction));
                return interaction.editReply({ embeds: [embed] });
            }

            const giverBank = BankManager.getBank(giver.bankType);
            const transferFeePercent = giverBank.transferFeePercent;
            const fee = Math.floor(amount * (transferFeePercent / 100));
            if (giver.kythiaBank < amount + fee) {
                const embed = new EmbedBuilder()
                    .setColor(kythia.bot.color)
                    .setDescription(await t(interaction, 'economy.transfer.transfer.not.enough.bank.fee', { fee }))
                    .setThumbnail(interaction.user.displayAvatarURL())
                    .setTimestamp()
                    .setFooter(await embedFooter(interaction));
                return interaction.editReply({ embeds: [embed] });
            }

            const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

            const confirmEmbed = new EmbedBuilder()
                .setColor(kythia.bot.color)
                .setThumbnail(interaction.user.displayAvatarURL())
                .setDescription(
                    await t(interaction, 'economy.transfer.transfer.confirm', {
                        amount,
                        target: target.username,
                        fee,
                    })
                )
                .setTimestamp()
                .setFooter(await embedFooter(interaction));

            const row = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setCustomId('confirm')
                    .setLabel(await t(interaction, 'economy.transfer.transfer.btn.confirm'))
                    .setStyle(ButtonStyle.Success),
                new ButtonBuilder()
                    .setCustomId('cancel')
                    .setLabel(await t(interaction, 'economy.transfer.transfer.btn.cancel'))
                    .setStyle(ButtonStyle.Danger)
            );

            await interaction.editReply({ embeds: [confirmEmbed], components: [row] });

            const filter = (i) => i.user.id === interaction.user.id;
            const collector = interaction.channel.createMessageComponentCollector({ filter, time: 15000 });

            collector.on('collect', async (i) => {
                if (i.customId === 'confirm') {
                    giver.kythiaBank = BigInt(giver.kythiaBank) - BigInt(amount + fee);
                    receiver.kythiaBank = BigInt(receiver.kythiaBank) + BigInt(amount);

                    giver.changed('kythiaBank', true);
                    receiver.changed('kythiaBank', true);

                    await giver.saveAndUpdateCache('userId');
                    await receiver.saveAndUpdateCache('userId');

                    const embed = new EmbedBuilder()
                        .setColor(kythia.bot.color)
                        .setThumbnail(interaction.user.displayAvatarURL())
                        .setDescription(
                            await t(interaction, 'economy.transfer.transfer.success', {
                                amount,
                                target: target.username,
                                fee,
                            })
                        )
                        .setTimestamp()
                        .setFooter(await embedFooter(interaction));
                    await i.update({ embeds: [embed], components: [] });

                    const targetEmbed = new EmbedBuilder()
                        .setColor(kythia.bot.color)
                        .setThumbnail(interaction.user.displayAvatarURL())
                        .setDescription(
                            await t(interaction, 'economy.transfer.transfer.received', {
                                amount,
                                from: interaction.user.username,
                            })
                        )
                        .setTimestamp()
                        .setFooter(await embedFooter(interaction));
                    try {
                        await target.send({ embeds: [targetEmbed] });
                    } catch (e) {}
                } else if (i.customId === 'cancel') {
                    const embed = new EmbedBuilder()
                        .setColor(kythia.bot.color)
                        .setDescription(await t(interaction, 'economy.transfer.transfer.cancelled'))
                        .setTimestamp()
                        .setFooter(await embedFooter(interaction));
                    await i.update({ embeds: [embed], components: [] });
                }
            });

            collector.on('end', async (collected) => {
                if (collected.size === 0) {
                    const embed = new EmbedBuilder()
                        .setColor(kythia.bot.color)
                        .setDescription(await t(interaction, 'economy.transfer.transfer.timeout'))
                        .setTimestamp()
                        .setFooter(await embedFooter(interaction));
                    await interaction.editReply({ embeds: [embed], components: [] });
                }
            });
        } catch (error) {
            console.error('Error during transfer command execution:', error);
            const embed = new EmbedBuilder()
                .setColor(kythia.bot.color)
                .setDescription(await t(interaction, 'economy.transfer.transfer.error'))
                .setTimestamp()
                .setFooter(await embedFooter(interaction));
            return interaction.editReply({ embeds: [embed] });
        }
    },
};
