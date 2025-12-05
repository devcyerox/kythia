/**
 * @namespace: addons/globalchat/register.js
 * @type: Module
 * @copyright © 2025 kenndeclouv
 * @assistant chaa & graa
 * @version 0.10.1-beta
 */

const _logger = require('@coreHelpers/logger');
const { initializeWebhookHealthCheck } = require('./tasks/webhookHealthCheck');

module.exports = {
	async initialize(bot) {
		const summery = [];
		bot.addClientReadyHook(() => {
			initializeWebhookHealthCheck(bot);
		});
		summery.push('   └─ Task: Webhook Health Check (Cron Job) On');

		return summery;
	},
};
