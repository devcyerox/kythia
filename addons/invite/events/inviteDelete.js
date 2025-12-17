/**
 * @namespace: addons/invite/events/inviteDelete.js
 * @type: Event Handler
 * @copyright © 2025 kenndeclouv
 * @assistant chaa & graa
 * @version 0.11.0-beta
 */

const { getGuildInviteCache } = require('../helpers');

module.exports = async (_bot, invite) => {
	try {
		const cache = getGuildInviteCache(invite.guild.id);
		cache.delete(invite.code);
	} catch {}
};
