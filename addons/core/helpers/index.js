/**
 * @namespace: addons/core/helpers/index.js
 * @type: Helper Script
 * @copyright © 2025 kenndeclouv
 * @assistant chaa & graa
 * @version 0.11.0-beta
 */

const logger = require('@coreHelpers/logger');

/**
 * Helper delay biar gak kena Rate Limit Discord
 */
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Clean up user cache, with translation for logs.
 * @param {Map} userCache
 * @param {object} interaction - Discord interaction/message for translation context
 */
async function cleanupUserCache(userCache) {
	if (!userCache || typeof userCache.entries !== 'function') {
		const warnMsg = '⚠️ User cache is invalid or not iterable.';
		logger.warn(warnMsg);
		return;
	}

	const now = Date.now();
	const expirationTime = 12 * 60 * 60 * 1000;

	for (const [key, userData] of userCache.entries()) {
		if (!userData || !Array.isArray(userData.duplicateMessages)) {
			userCache.delete(key);
			continue;
		}
		const lastMessage =
			userData.duplicateMessages[userData.duplicateMessages.length - 1];

		if (!lastMessage || now - lastMessage.createdTimestamp > expirationTime) {
			userCache.delete(key);
		}
	}
	const logMsg = '🧹 [CACHE CLEANUP] userCache cleaned';
	logger.info(logMsg);
}

/**
 * Set role prefix to member nicknames, with fetch & delay safety.
 * @param {import('discord.js').Guild} guild
 * @param {object} interaction
 */
async function rolePrefix(guild, _interaction) {
	const prefixPattern = /^([^\w\d\s@]{1,5}(?:\s?•)?)/;

	const prefixRoles = guild.roles.cache
		.filter((role) => prefixPattern.test(role.name))
		.sort((a, b) => b.position - a.position)
		.map((role) => {
			const match = role.name.match(prefixPattern);
			return {
				roleId: role.id,
				prefix: match ? match[1] : '',
				position: role.position,
			};
		});

	if (prefixRoles.length === 0) return 0;

	let updated = 0;

	let allMembers;
	try {
		allMembers = await guild.members.fetch();
	} catch (e) {
		logger.error(
			`[RolePrefix] Failed to fetch members for ${guild.name}: ${e.message}`,
		);
		return 0;
	}

	for (const member of allMembers.values()) {
		const isBotSelf = member.id === guild.client.user.id;

		if (!member.manageable && !isBotSelf) continue;

		const matching = prefixRoles.find((r) => member.roles.cache.has(r.roleId));
		if (!matching) continue;

		const currentNick = member.nickname || member.user.username;

		const baseName = currentNick.replace(prefixPattern, '').trimStart();

		const newNick = `${matching.prefix} ${baseName}`;

		if (currentNick !== newNick) {
			try {
				await member.setNickname(newNick);
				updated++;

				await sleep(1000);
			} catch (err) {
				logger.warn(
					`❌ Failed nick update for ${member.user.tag}: ${err.message}`,
				);
			}
		}
	}

	return updated;
}

/**
 * Remove role prefix (Logic sama: Fetch + Sleep)
 */
async function roleUnprefix(guild, _interaction) {
	const prefixPattern = /^([^\w\d\s]{1,5}(?:\s?•)?)\s?/;
	let updated = 0;

	let allMembers;
	try {
		allMembers = await guild.members.fetch();
	} catch (e) {
		logger.error(`[RoleUnprefix] Fetch failed: ${e.message}`);
		return 0;
	}

	for (const member of allMembers.values()) {
		const isBotSelf = member.id === guild.client.user.id;

		if (!member.manageable && !isBotSelf) continue;

		const currentNick = member.nickname;
		if (!currentNick || !prefixPattern.test(currentNick)) continue;

		const baseName = currentNick.replace(prefixPattern, '');

		if (currentNick !== baseName) {
			try {
				await member.setNickname(baseName);
				updated++;

				await sleep(1000);
			} catch (err) {
				logger.warn(`Failed nick reset for ${member.user.tag}: ${err.message}`);
			}
		}
	}

	return updated;
}

module.exports = {
	cleanupUserCache,
	rolePrefix,
	roleUnprefix,
};
