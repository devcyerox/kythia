/**
 * @namespace: addons/globalchat/tasks/webhookHealthCheck.js
 * @type: Scheduled Task
 * @copyright © 2025 kenndeclouv
 * @assistant chaa & graa
 * @version 0.9.10-beta
 */

const fetch = require('node-fetch');
const cron = require('node-cron');
const { handleFailedGlobalChat } = require('../helpers/handleFailedGlobalChat');
const GlobalChat = require('../database/models/GlobalChat');

/**
 * Sleep for ms milliseconds
 * @param {number} ms
 * @returns {Promise<void>}
 */
function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Initializes the webhook health check task for Global Chat
 * Runs periodically to proactively check webhook health
 * @param {object} bot - The bot instance with client, logger, container
 */
function initializeWebhookHealthCheck(bot) {
    const { client, container } = bot;
    const logger = container.logger;

    const schedule = kythia.addons.globalchat.healthCheckSchedule || '0 */1 * * *';
    const checkDelayMs = kythia.addons.globalchat.healthCheckDelay || 1000;

    logger.info(`🌏 [GlobalChat] Initializing webhook health check task with schedule: ${schedule}`);

    cron.schedule(
        schedule,
        async () => {
            logger.info('🌏 [GlobalChat] Starting proactive webhook health check from LOCAL DB...');

            let myManagedGuilds;
            try {
                myManagedGuilds = await GlobalChat.getAllCache();

                if (!myManagedGuilds || myManagedGuilds.length === 0) {
                    logger.info('🌏 [GlobalChat-Cron] No guilds found in local DB. Skipping check.');
                    return;
                }
            } catch (err) {
                logger.error('❌ [GlobalChat-Cron] Failed to fetch guild list from LOCAL DB:', err);
                return;
            }

            logger.info(`🌏 [GlobalChat-Cron] Checking ${myManagedGuilds.length} guilds managed by this bot instance...`);

            for (const guildInfo of myManagedGuilds) {
                try {
                    if (!client.guilds.cache.has(guildInfo.guildId)) {
                        logger.warn(
                            `⚠️ [GlobalChat-Cron] Bot is no longer in guild ${guildInfo.guildId}, but it's still in local DB. Skipping check.`
                        );

                        continue;
                    }

                    const webhookUrl = `https://discord.com/api/webhooks/${guildInfo.webhookId}/${guildInfo.webhookToken}`;
                    const webhookResponse = await fetch(webhookUrl);

                    if (webhookResponse.status === 404) {
                        logger.warn(
                            `⚠️ [GlobalChat-Cron] Proactive check found a DEAD webhook (404) for guild ${guildInfo.guildName || guildInfo.guildId}. Triggering self-heal!`
                        );

                        const failedGuild = {
                            guildId: guildInfo.guildId,
                            guildName:
                                guildInfo.guildName ||
                                (await client.guilds.fetch(guildInfo.guildId).catch(() => null))?.name ||
                                guildInfo.guildId,
                            error: 'Proactive check failed: 404 Not Found',
                        };

                        handleFailedGlobalChat([failedGuild], container).catch((err) => {
                            logger.error(`❌ [GlobalChat-Cron] Self-heal attempt failed:`, err);
                        });
                    } else if (!webhookResponse.ok) {
                        logger.warn(
                            `⚠️ [GlobalChat-Cron] Webhook for ${guildInfo.guildId} returned non-OK status: ${webhookResponse.status}`
                        );
                    }
                } catch (fetchError) {
                    logger.error(`❌ [GlobalChat-Cron] Error checking webhook for guild ${guildInfo.guildId}:`, fetchError);
                }

                await sleep(checkDelayMs);
            }
            logger.info('🌏 [GlobalChat] Proactive webhook health check finished.');
        },
        {
            timezone: kythia.bot.timezone,
        }
    );
}

module.exports = { initializeWebhookHealthCheck };
