/**
 * @namespace: addons/tempvoice/select_menus/tv_unblock_menu.js
 * @type: Module
 * @copyright © 2025 kenndeclouv
 * @assistant chaa & graa
 * @version 0.10.1-beta
 */
const { PermissionsBitField, MessageFlags } = require('discord.js');

module.exports = {
	execute: async (interaction, container) => {
		const { models, client, t, helpers, logger } = container;
		const { simpleContainer } = helpers.discord;
		const { TempVoiceChannel } = models;

		const channelId = interaction.customId.split(':')[1];

		if (!channelId)
			return interaction.update({
				components: await simpleContainer(
					interaction,
					await t(interaction, 'tempvoice.common.no_channel_id'),
					{ color: 'Red' },
				),
			});
		const activeChannel = await TempVoiceChannel.getCache({
			channelId: channelId,
			ownerId: interaction.user.id,
		});
		if (!activeChannel)
			return interaction.update({
				components: await simpleContainer(
					interaction,
					await t(interaction, 'tempvoice.common.not_owner'),
					{ color: 'Red' },
				),
			});
		let channel;
		try {
			channel = await client.channels.fetch(channelId, { force: true });
		} catch (error) {
			logger.error(
				`[TempVoice] CRITICAL: Failed to fetch channel ${channelId} for rename. Error:`,
				error,
			);

			return interaction.reply({
				components: await simpleContainer(
					interaction,
					await t(interaction, 'tempvoice.common.channel_not_found'),
					{ color: 'Red' },
				),
				flags: MessageFlags.Ephemeral | MessageFlags.IsComponentsV2,
			});
		}
		if (!channel)
			return interaction.update({
				components: await simpleContainer(
					interaction,
					await t(interaction, 'tempvoice.common.channel_not_found'),
					{
						color: 'Red',
					},
				),
			});

		const userIdsToUnblock = interaction.values;
		const unblockedNames = [];

		try {
			for (const userId of userIdsToUnblock) {
				const member = await interaction.guild.members
					.fetch(userId)
					.catch(() => null);
				if (member) {
					await channel.permissionOverwrites.edit(member, {
						[PermissionsBitField.Flags.ViewChannel]: null,
						[PermissionsBitField.Flags.Connect]: null,
					});
					unblockedNames.push(member.displayName);
				}
			}

			await interaction.update({
				components: await simpleContainer(
					interaction,
					await t(interaction, 'tempvoice.unblock.success', {
						users: unblockedNames.join(', '),
					}),
					{ color: 'Green' },
				),
			});
		} catch (_err) {
			await interaction.update({
				components: await simpleContainer(
					interaction,
					await t(interaction, 'tempvoice.common.fail'),
					{ color: 'Red' },
				),
			});
		}
	},
};
