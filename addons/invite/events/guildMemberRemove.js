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

	const container = bot.client.container;
	const { t, models, helpers, logger } = container;
	const { Invite, InviteHistory, ServerSetting } = models;
	const { simpleContainer } = helpers.discord;

	let inviteChannelId = null;
	try {
		const setting = await ServerSetting.getCache({ guildId: guild.id });
		if (!setting?.invitesOn) return;
		inviteChannelId = setting.inviteChannelId;
	} catch (_e) {}

	const history = await InviteHistory.getCache({
		guildId: guild.id,
		memberId: memberId,
		status: 'active',
	});

	let logMessage = '';

	if (history?.inviterId) {
		history.status = 'left';
		await history.save();

		const [inviterStats] = await Invite.findOrCreateWithCache({
			where: { guildId: guild.id, userId: history.inviterId },
			defaults: { guildId: guild.id, userId: history.inviterId },
		});

		if (inviterStats) {
			const wasFake = history.isFake;

			if (wasFake) {
				inviterStats.fake = Math.max(0, (inviterStats.fake || 0) - 1);
			} else {
				inviterStats.invites = Math.max(0, (inviterStats.invites || 0) - 1);
			}

			inviterStats.leaves = (inviterStats.leaves || 0) + 1;

			inviterStats.changed('invites', true);
			inviterStats.changed('fake', true);

			await inviterStats.saveAndUpdateCache();

			logger.info(
				`${member.user.tag} left. Deducted ${wasFake ? 'fake' : 'real'} invite from ${history.inviterId}.`,
				{ label: 'Invite Tracker' },
			);

			const title = await t(
				guild,
				'invite.events.guildMemberRemove.tracker.title',
			);
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
			`${member.user.tag} left, but no active invite history found.`,
			{ label: 'Invite Tracker' },
		);

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

	if (inviteChannelId && logMessage) {
		const channel = await guild.channels
			.fetch(inviteChannelId)
			.catch(() => null);
		if (channel?.isTextBased && channel.viewable) {
			try {
				const components = await simpleContainer(member, logMessage, {
					color: 'Red',
				});
				await channel.send({ components, flags: MessageFlags.IsComponentsV2 });
			} catch (error) {
				logger.error(
					`Error sending invite log to channel ${inviteChannelId} in ${guild.name}:`,
					error,
					{ label: 'Invite Tracker' },
				);
			}
		} else {
			logger.warn(
				`Invite channel ${inviteChannelId} not found in ${guild.name}`,
				{ label: 'Invite Tracker' },
			);
		}
	}
};
