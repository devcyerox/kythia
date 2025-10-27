/**
 * @namespace: addons/economy/commands/account/create.js
 * @type: Command
 * @copyright © 2025 kenndeclouv
 * @assistant chaa & graa
 * @version 0.9.10-beta
 */
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const KythiaUser = require('@coreModels/KythiaUser');
const { embedFooter } = require('@coreHelpers/discord');
const { t } = require('@coreHelpers/translator');
const BankManager = require('../../helpers/bankManager');
module.exports = {
    subcommand: true,
    data: (subcommand) =>
        subcommand
            .setName('create')
            .setDescription('👤 Create an account and choose a bank type.')
            .addStringOption((option) =>
                option
                    .setName('bank')
                    .setDescription('Each bank offers unique benefits for your playstyle!')
                    .setRequired(true)
                    .addChoices(
                        ...BankManager.getAllBanks().map((bank) => ({
                            name: `${bank.emoji} ${bank.name}`,
                            value: bank.id,
                        }))
                    )
            ),
    async execute(interaction) {
        await interaction.deferReply();
        const bankType = interaction.options.getString('bank');
        const userId = interaction.user.id;
        const userBank = BankManager.getBank(bankType);
        const bankDisplay = `${userBank.emoji} ${userBank.name}`;
        const existingUser = await KythiaUser.getCache({ userId: userId });
        if (existingUser) {
            const embed = new EmbedBuilder()
                .setColor(kythia.bot.color)
                .setDescription(await t(interaction, 'economy.account.create.account.create.already.desc'))
                .setThumbnail(interaction.user.displayAvatarURL())
                .setFooter(await embedFooter(interaction));
            return interaction.editReply({ embeds: [embed] });
        }

        // Create new user account
        await KythiaUser.create({ userId, bankType });

        const embed = new EmbedBuilder()
            .setColor(kythia.bot.color)
            .setDescription(await t(interaction, 'economy.account.create.account.create.success.desc', { bankType: bankDisplay }))
            .setThumbnail(interaction.user.displayAvatarURL())
            .setFooter(await embedFooter(interaction));
        return interaction.editReply({ embeds: [embed] });
    },
};
