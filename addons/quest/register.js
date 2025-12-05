/**
 * @namespace: addons/quest/register.js
 * @type: Module
 * @copyright © 2025 kenndeclouv
 * @assistant chaa & graa
 * @version 0.10.1-beta
 */
const { initializeQuestScheduler } = require('./tasks/questScheduler');

module.exports = {
	async initialize(bot) {
		const summary = [];

		bot.addClientReadyHook(() => {
			initializeQuestScheduler(bot);
		});

		summary.push(' └─ ⏰ Quest Notifier cron task registered.');
		return summary;
	},
};
