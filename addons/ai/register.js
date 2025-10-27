/**
 * @namespace: addons/ai/register.js
 * @type: Module
 * @copyright © 2025 kenndeclouv
 * @assistant chaa & graa
 * @version 0.9.10-beta
 */

const logger = require('@coreHelpers/logger');
const { generateCommandSchema } = require('./helpers/commandSchema');
const { initializeAiTasks } = require('./tasks/dailyGreeter');

module.exports = {
    async initialize(bot) {
        const summery = [];
        bot.addClientReadyHook(() => {
            bot.aiCommandSchema = generateCommandSchema(bot.client);
            logger.info(`✅ Successfully loaded ${bot.aiCommandSchema.length} command schema for AI.`);
        });
        if (kythia.addons.ai.dailyGreeter == true) {
            initializeAiTasks(bot);
            summery.push('   └─ Task: Daily Greeter (Cron Job) On');
        } else {
            summery.push('   └─ Task: Daily Greeter (Cron Job) Off');
        }
        return summery;
    },
};
