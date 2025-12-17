/**
 * @namespace: addons/api/register.js
 * @type: Module
 * @copyright © 2025 kenndeclouv
 * @assistant chaa & graa
 * @version 0.11.0-beta
 */

const initializeServer = require('./server');

module.exports = {
	async initialize(bot) {
		const summary = [];
		await initializeServer(bot);
		summary.push('   └─ 🚀 Initializing API...');

		return summary;
	},
};
