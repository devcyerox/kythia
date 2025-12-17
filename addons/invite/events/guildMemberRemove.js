/**
 * @namespace: addons/invite/events/guildMemberRemove.js
 * @type: Event Handler
 * @copyright © 2025 kenndeclouv
 * @assistant chaa & graa
 * @version 0.11.0-beta
 */

const { MessageFlags } = require('discord.js');

module.exports = async (bot, member) => {
	if (!member || !member.guild) return;
	const { guild, id: memberId } = member;

	// Setup container utils
	const container = bot.client.container;
	const { t, models, helpers, logger } = container;
	const { Invite, InviteHistory, ServerSetting } = models;
	const { simpleContainer } = helpers.discord;

	// Cek setting dulu
	let inviteChannelId = null;
	try {
		const setting = await ServerSetting.getCache({ guildId: guild.id });
		if (!setting?.invitesOn) return;
		inviteChannelId = setting.inviteChannelId;
	} catch (_e) {}

	// 1. Cari siapa yang dulu invite orang ini
	const history = await InviteHistory.getCache({
		guildId: guild.id,
		memberId: memberId,
		status: 'active', // Cari yang masih active
	});

	let logMessage = '';

	if (history?.inviterId) {
		// Tandai history jadi 'left'
		history.status = 'left';
		await history.save();

		// 2. Ambil data si pengundang (Inviter)
		const [inviterStats] = await Invite.findOrCreateWithCache({
			where: { guildId: guild.id, userId: history.inviterId },
			defaults: { guildId: guild.id, userId: history.inviterId },
		});

		if (inviterStats) {
			// 3. Cek status di history
			const wasFake = history.isFake;

			// 4. Update Stats Inviter (Kurangi poin)
			if (wasFake) {
				inviterStats.fake = Math.max(0, (inviterStats.fake || 0) - 1);
			} else {
				inviterStats.invites = Math.max(0, (inviterStats.invites || 0) - 1);
			}

			// Tambah counter leaves
			inviterStats.leaves = (inviterStats.leaves || 0) + 1;

			// 🔥 PENTING: Gunakan saveAndUpdateCache
			inviterStats.changed('invites', true);
			inviterStats.changed('fake', true);

			await inviterStats.saveAndUpdateCache();

			logger.info(
				`[INVITE TRACKER] ${member.user.tag} left. Deducted ${wasFake ? 'fake' : 'real'} invite from ${history.inviterId}.`,
			);

			// Siapkan pesan log untuk inviter
			const title = await t(
				guild,
				'invite.events.guildMemberRemove.tracker.title',
			); // Pastikan key ini ada atau pake default
			const leftMsg = await t(
				guild,
				'invite.events.guildMemberRemove.tracker.left',
				{
					user: `<@${member.id}>`,
					username: member.user.username,
					inviter: `<@${history.inviterId}>`,
				},
			);
			const typeMsg = wasFake ? '(Fake)' : '(Real)';

			logMessage = `## 📤 ${title}\n${leftMsg} ${typeMsg}`;
		}
	} else {
		logger.info(
			`[INVITE TRACKER] ${member.user.tag} left, but no active invite history found.`,
		);
		// Pesan log kalau gak nemu inviter (Unknown Leave)
		const title = await t(
			guild,
			'invite.events.guildMemberRemove.tracker.title',
		);
		const leftUnknown = await t(
			guild,
			'invite.events.guildMemberRemove.tracker.unknown',
			{
				user: `<@${member.id}>`,
				username: member.user.username,
			},
		);
		logMessage = `## 📤 ${title}\n${leftUnknown}`;
	}

	// 5. Send Log to Channel
	if (inviteChannelId && logMessage) {
		const channel = await guild.channels
			.fetch(inviteChannelId)
			.catch(() => null);
		if (channel?.isTextBased && channel.viewable) {
			try {
				const components = await simpleContainer(
					member,
					logMessage,
					{ color: 'Red' }, // Merah karena user leave
				);
				await channel.send({ components, flags: MessageFlags.IsComponentsV2 });
			} catch (error) {
				logger.error(
					`[INVITE] Error sending invite log to channel ${inviteChannelId} in ${guild.name}:`,
					error,
				);
			}
		} else {
			logger.warn(
				`[INVITE] Invite channel ${inviteChannelId} not found in ${guild.name}`,
			);
		}
	}
};
