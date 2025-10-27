/**
 * @namespace: addons/economy/commands/beg.js
 * @type: Command
 * @copyright © 2025 kenndeclouv
 * @assistant chaa & graa
 * @version 0.9.10-beta
 */
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { embedFooter } = require('@coreHelpers/discord');
const { checkCooldown } = require('@utils/time');
const KythiaUser = require('@coreModels/KythiaUser');
const { t } = require('@coreHelpers/translator');
const BankManager = require('../helpers/bankManager');

module.exports = {
    subcommand: true,
    data: (subcommand) => subcommand.setName('beg').setDescription('💰 Ask for money from server.'),
    async execute(interaction) {
        await interaction.deferReply();

        let user = await KythiaUser.getCache({ userId: interaction.user.id });
        if (!user) {
            const embed = new EmbedBuilder()
                .setColor(kythia.bot.color)
                .setDescription(await t(interaction, 'economy.withdraw.no.account.desc'))
                .setThumbnail(interaction.user.displayAvatarURL())
                .setFooter(await embedFooter(interaction));
            return interaction.editReply({ embeds: [embed] });
        }

        const cooldown = checkCooldown(user.lastBeg, kythia.addons.economy.begCooldown || 3600, interaction);
        if (cooldown.remaining) {
            const embed = new EmbedBuilder()
                .setColor('Yellow')
                .setDescription(await t(interaction, 'economy.beg.beg.cooldown', { time: cooldown.time }))
                .setThumbnail(interaction.user.displayAvatarURL())
                .setFooter(await embedFooter(interaction));
            return interaction.editReply({ embeds: [embed] });
        }

        const baseCoin = Math.floor(Math.random() * 21) + 5;

        const userBank = BankManager.getBank(user.bankType);
        const incomeBonusPercent = userBank.incomeBonusPercent;
        const bankBonus = Math.floor(baseCoin * (incomeBonusPercent / 100));
        const randomCoin = baseCoin + bankBonus;

        user.kythiaCoin = BigInt(user.kythiaCoin) + BigInt(randomCoin);
        user.lastBeg = Date.now();

        user.changed('kythiaCoin', true);
        user.changed('lastBeg', true);

        await user.saveAndUpdateCache('userId');

        const embed = new EmbedBuilder()
            .setColor(kythia.bot.color)
            .setThumbnail(interaction.user.displayAvatarURL())
            .setDescription(await t(interaction, 'economy.beg.beg.success', { amount: randomCoin }))
            .setFooter(await embedFooter(interaction));
        return interaction.editReply({ embeds: [embed] });
    },
};
