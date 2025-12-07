/**
 * @namespace: addons/tempvoice/buttons/tv_waiting_allow.js
 * @type: Module
 * @copyright © 2025 kenndeclouv
 * @assistant chaa & graa
 * @version 0.10.1-beta
 */
const { MessageFlags } = require('discord.js');

module.exports = {
	execute: async (interaction, container) => {
		const { models, client, t, helpers, logger } = container;
		const { simpleContainer } = helpers.discord;
		const { TempVoiceChannel } = models;

		const [_, mainChannelId, userIdToMove] = interaction.customId.split(':');

		// 1. Cek kepemilikan
		const activeChannel = await TempVoiceChannel.getCache({
			channelId: mainChannelId,
			ownerId: interaction.user.id,
		});
		if (!activeChannel)
			return interaction.reply({
				content: await t(interaction, 'tempvoice.common.not_owner'),
				ephemeral: true,
			});

		// 2. Fetch channel & user
		let mainChannel;
		try {
			mainChannel = await client.channels.fetch(mainChannelId, { force: true });
		} catch (error) {
			logger.error(
				`[TempVoice] CRITICAL: Failed to fetch channel ${mainChannelId} for rename. Error:`,
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
		const member = await interaction.guild.members
			.fetch(userIdToMove)
			.catch(() => null);

		if (!mainChannel || !member)
			return interaction.reply({
				content: await t(interaction, 'tempvoice.waiting.user_or_channel_gone'),
				ephemeral: true,
			});

		// 3. Pindahin user
		try {
			await member.voice.setChannel(mainChannel);
			await interaction.message.delete(); // Hapus pesan notif
		} catch (_e) {
			await interaction.reply({
				content: await t(interaction, 'tempvoice.waiting.move_fail'),
				ephemeral: true,
			});
		}
	},
};
