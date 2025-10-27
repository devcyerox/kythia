/**
 * @namespace: addons/core/commands/moderation/unmute.js
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
        .setName('unmute')
        .setDescription('🔊 Unmutes a user in a voice channel.')
        .addUserOption((option) => option.setName('user').setDescription('User to unmute').setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.MuteMembers)
        .setContexts(InteractionContextType.Guild),
    permissions: PermissionFlagsBits.MuteMembers,
    botPermissions: PermissionFlagsBits.MuteMembers,
    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });
        const user = interaction.options.getUser('user');

        let member;
        try {
            member = await interaction.guild.members.fetch(user.id);
        } catch (e) {
            member = null;
        }

        if (member) {
            await member.voice.setMute(false, 'Unmuted by command.');
            const embed = new EmbedBuilder()
                .setColor(kythia.bot.color)
                .setDescription(
                    `## ${await t(interaction, 'core.moderation.unmute.embed.title')}\n` +
                        (await t(interaction, 'core.moderation.unmute.embed.desc', { user: `<@${user.id}>` }))
                )
                .setThumbnail(interaction.client.user.displayAvatarURL())
                .setTimestamp()
                .setFooter(await embedFooter(interaction));
            return interaction.editReply({ embeds: [embed] });
        } else {
            return interaction.editReply({
                content: await t(interaction, 'core.moderation.unmute.user.not.found'),
            });
        }
    },
};
