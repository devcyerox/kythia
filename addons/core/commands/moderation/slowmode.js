/**
 * @namespace: addons/core/commands/moderation/slowmode.js
 * @type: Command
 * @copyright © 2025 kenndeclouv
 * @assistant chaa & graa
 * @version 0.9.10-beta
 */
const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, InteractionContextType } = require('discord.js');
const { embedFooter } = require('@coreHelpers/discord');
const { t } = require('@coreHelpers/translator');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('slowmode')
        .setDescription('⏳ Sets the slowmode for the channel.')
        .addIntegerOption((option) => option.setName('duration').setDescription('Duration in seconds').setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
        .setContexts(InteractionContextType.Guild),

    permissions: PermissionFlagsBits.ManageChannels,
    botPermissions: PermissionFlagsBits.ManageChannels,
    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });
        const duration = interaction.options.getInteger('duration');
        await interaction.channel.setRateLimitPerUser(duration);

        const embed = new EmbedBuilder()
            .setColor(kythia.bot.color)
            .setDescription(
                `## ⏳ ${await t(interaction, 'core.moderation.slowmode.title')}\n` +
                    (await t(interaction, 'core.moderation.slowmode.set.success', { duration }))
            )
            .setThumbnail(interaction.client.user.displayAvatarURL())
            .setTimestamp()
            .setFooter(await embedFooter(interaction));
        return interaction.editReply({ embeds: [embed] });
    },
};
