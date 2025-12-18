/**
 * @namespace: addons/ai/register.js
 * @type: Module
 * @copyright © 2025 kenndeclouv
 * @assistant chaa & graa
 * @version 0.11.0-beta
 */

const { generateCommandSchema } = require('./helpers/command-schema');
const { initializeAiTasks } = require('./tasks/daily-greeter');
const promptBuilder = require('./helpers/prompt-builder');
const geminiHelper = require('./helpers/gemini');

module.exports = {
	async initialize(bot) {
		const logger = bot.container.logger;
		const isOwner = bot.container.helpers.discord.isOwner;
		const summery = [];

		// Initialize Gemini Helper
		geminiHelper.init({ logger, config: bot.container.kythiaConfig });
		summery.push('   └─ Gemini Helper initialized.');

		// Initialize Prompt Builder
		promptBuilder.init({ isOwner, config: bot.container.kythiaConfig });
		summery.push('   └─ Prompt Builder initialized.');

		bot.addClientReadyHook(() => {
			bot.aiCommandSchema = generateCommandSchema(bot.client);
			logger.info(
				`✅ Successfully loaded ${bot.aiCommandSchema.length} command schema for AI.`,
			);

			if (bot.container.kythiaConfig.addons.ai.dailyGreeter === true) {
				initializeAiTasks(bot);
				summery.push('   └─ Task: Daily Greeter (Cron Job) On');
			} else {
				summery.push('   └─ Task: Daily Greeter (Cron Job) Off');
			}
		});

		return summery;
	},
};
