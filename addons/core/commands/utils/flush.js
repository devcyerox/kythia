/**
 * @namespace: addons/core/commands/utils/flush.js
 * @type: Command
 * @copyright © 2025 kenndeclouv
 * @assistant chaa & graa
 * @version 0.9.11-beta
 */

const { SlashCommandBuilder, InteractionContextType } = require('discord.js');
const Redis = require('ioredis');

module.exports = {
    data: new SlashCommandBuilder().setName('flush').setDescription('💥 Flush Redis Cache').setContexts(InteractionContextType.BotDM),
    ownerOnly: true,

    async execute(interaction, container) {
        const { logger } = container;

        await interaction.deferReply({ ephemeral: true });

        let redis;
        try {
            redis = new Redis(kythia.db.redis);

            logger.debug('[REDIS FLUSH] Connecting to Redis...');

            // Ping Redis to ensure connection
            const pong = await redis.ping();
            logger.debug(`[REDIS FLUSH] Redis ping response: ${pong}`);

            logger.debug('[REDIS FLUSH] Attempting to FLUSHALL...');
            const result = await redis.flushall();
            logger.debug(`[REDIS FLUSH] FLUSHALL result: ${result}`);

            // Confirm by checking dbsize
            const dbsize = await redis.dbsize();
            logger.debug(`[REDIS FLUSH] dbsize after FLUSHALL: ${dbsize}`);

            if (result === 'OK' && dbsize === 0) {
                await interaction.editReply('✅ Redis cache berhasil di-flush (kosong).');
            } else {
                await interaction.editReply(`⚠️ FLUSHALL dijalankan, tapi dbsize: ${dbsize}.`);
            }
        } catch (e) {
            logger.error('[REDIS FLUSH] Manual flush failed:', e);
            await interaction.editReply('❌ Gagal melakukan flush cache.');
        } finally {
            if (redis) await redis.quit();
            logger.debug('[REDIS FLUSH] Redis connection closed.');
        }
    },
};
