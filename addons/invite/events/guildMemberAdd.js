/**
 * @namespace: addons/invite/events/guildMemberAdd.js
 * @type: Event Handler
 * @copyright © 2025 kenndeclouv
 * @assistant chaa & graa
 * @version 0.10.0-beta
 */

const { getGuildInviteCache, refreshGuildInvites } = require('../helpers');
const { PermissionsBitField, MessageFlags } = require('discord.js');

const FAKE_ACCOUNT_AGE_DAYS = 7;

module.exports = async (bot, member) => {
	if (!member || !member.guild) return;
	const guild = member.guild;

	const container = bot.client.container;
	const { models, helpers, t, logger, kythiaConfig } = container;
	const { ServerSetting, Invite, InviteHistory } = models;
	const { simpleContainer } = helpers.discord;
	const { convertColor } = helpers.color;

	let inviteChannelId = null;
	let setting;
	try {
		setting = await ServerSetting.getCache({ guildId: guild.id });
		inviteChannelId = setting?.inviteChannelId;
	} catch (e) {
		logger.error(
			`[INVITE TRACKER] Error fetching server setting: ${e.message}`,
		);
	}

	if (!setting?.inviteChannelId || !setting?.invitesOn) return;

	const me = guild.members.me || (await guild.members.fetchMe());
	if (!me.permissions.has(PermissionsBitField.Flags.ManageGuild)) {
		logger.warn(
			`[INVITE TRACKER] Missing 'Manage Guild' permission in ${guild.name}`,
		);
	}

	const cacheBefore = getGuildInviteCache(guild.id);

	let inviterId = null;
	let inviterUser = null;
	let inviteType = 'unknown';
	let inviteCode = null;

	try {
		const invitesNow = await guild.invites.fetch();

		for (const invite of invitesNow.values()) {
			const before = cacheBefore.get(invite.code);
			const beforeUses = before?.uses ?? 0;

			if (invite.uses > beforeUses) {
				inviterId = invite.inviter?.id || before?.inviterId || null;
				inviterUser = invite.inviter || null;
				inviteType = 'invite';
				inviteCode = invite.code;
				break;
			}
		}

		if (!inviterId && guild.vanityURLCode) {
			try {
				const vanity = await guild.fetchVanityData();
				if (vanity && vanity.uses > (cacheBefore.get('VANITY')?.uses ?? 0)) {
					inviteType = 'vanity';
					inviteCode = guild.vanityURLCode;
				}
			} catch (_e) {}
		}

		if (!inviterId && inviteType === 'unknown') {
			inviteType = member.user.bot ? 'oauth' : 'unknown';
		}

		const accountAgeDays =
			(Date.now() - member.user.createdTimestamp) / (1000 * 60 * 60 * 24);
		let isFake = false;

		if (inviterId) {
			isFake = accountAgeDays < FAKE_ACCOUNT_AGE_DAYS;

			const [inviteData] = await Invite.findOrCreateWithCache({
				where: { guildId: guild.id, userId: inviterId },
				defaults: {
					guildId: guild.id,
					userId: inviterId,
					invites: 0,
					fake: 0,
					leaves: 0,
				},
			});

			if (isFake) {
				inviteData.fake = (inviteData.fake || 0) + 1;
			} else {
				inviteData.invites = (inviteData.invites || 0) + 1;
			}

			await inviteData.saveAndUpdateCache();

			await InviteHistory.create({
				guildId: guild.id,
				inviterId: inviterId,
				memberId: member.id,
				status: 'active',
				isFake: isFake,
			});

			logger.info(
				`[INVITE] ${member.user.tag} joined (${isFake ? 'FAKE' : 'REAL'}), invited by ${inviterId}`,
			);
		}

		if (inviteChannelId) {
			const channel = await guild.channels
				.fetch(inviteChannelId)
				.catch(() => null);
			if (channel?.isTextBased && channel.viewable) {
				let embedDesc = '';
				const title = await t(
					guild,
					'invite.events.guildMemberAdd.tracker.title',
				);

				const accountAgeStr = await t(
					guild,
					'invite.events.guildMemberAdd.tracker.account.age',
					{
						days: Math.floor(accountAgeDays),
					},
				);

				if (inviterId) {
					const inviteTypeStr = isFake
						? await t(guild, 'invite.events.guildMemberAdd.tracker.type.fake')
						: await t(guild, 'invite.events.guildMemberAdd.tracker.type.real');

					const joinedBy = await t(
						guild,
						'invite.events.guildMemberAdd.tracker.joined.by',
						{
							user: `<@${member.id}>`,
							username: member.user.username,
							inviter: `<@${inviterId}>`,
							inviterTag: inviterUser?.tag || inviterId,
							inviteType: inviteTypeStr,
						},
					);

					const codeUsed = await t(
						guild,
						'invite.events.guildMemberAdd.tracker.code',
						{
							code: inviteCode,
						},
					);

					embedDesc = `${joinedBy}\n${codeUsed}\n${accountAgeStr}`;
				} else if (inviteType === 'vanity') {
					const joinedVanity = await t(
						guild,
						'invite.events.guildMemberAdd.tracker.joined.vanity',
						{
							user: `<@${member.id}>`,
							username: member.user.username,
							code: inviteCode,
						},
					);
					embedDesc = `${joinedVanity}\n${accountAgeStr}`;
				} else if (inviteType === 'oauth') {
					const joinedOauth = await t(
						guild,
						'invite.events.guildMemberAdd.tracker.joined.oauth',
						{
							user: `<@${member.id}>`,
							username: member.user.username,
						},
					);
					embedDesc = `${joinedOauth}\n${accountAgeStr}`;
				} else {
					const joinedUnknown = await t(
						guild,
						'invite.events.guildMemberAdd.tracker.joined.unknown',
						{
							user: `<@${member.id}>`,
							username: member.user.username,
						},
					);
					embedDesc = `${joinedUnknown}\n${accountAgeStr}`;
				}

				const finalContent = `## ${title}\n${embedDesc}`;

				const components = await simpleContainer(member, finalContent, {
					color: convertColor(kythiaConfig.bot.color, {
						from: 'hex',
						to: 'decimal',
					}),
				});

				channel.send({
					components: components,
					flags: MessageFlags.IsComponentsV2,
				});
			} else {
				logger.warn(
					`[INVITE] Invite channel ${inviteChannelId} not found in ${guild.name}`,
				);
			}
		}
	} catch (err) {
		logger.error(`[INVITE] Error guildMemberAdd:`, err);
	} finally {
		await refreshGuildInvites(guild);
	}
};
