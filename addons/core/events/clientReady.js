/**
 * @namespace: addons/core/events/clientReady.js
 * @type: Event Handler
 * @copyright © 2025 kenndeclouv
 * @assistant chaa & graa
 * @version 0.11.0-beta
 */

const { ActivityType } = require('discord.js');

function setBotPresence(client) {
	const { logger, kythiaConfig } = client.container;
	if (!client.isReady() || client.ws.shards.size === 0) return;

	if (!client.user) {
		logger.error('❌ client.user is undefined, cannot set presence.');
		return;
	}

	try {
		let activityType = ActivityType[kythiaConfig.bot.activityType];
		if (activityType === undefined) {
			logger.warn(
				`Invalid activityType '${kythiaConfig.bot.activityType}', defaulting to 'Playing'.`,
			);
			activityType = ActivityType.Playing;
		}
		client.user.setPresence({
			activities: [
				{
					name: kythiaConfig.bot.activity,
					type: activityType,
					url: kythiaConfig.bot.streakUrl || null,
				},
			],
			status: kythiaConfig.bot.status || 'online',
		});
		logger.info('✅ Bot presence has been set.');
	} catch (err) {
		logger.error('❌ Failed to set bot presence:', err);
	}
}

module.exports = (_bot, client) => {
	setBotPresence(client);
};
