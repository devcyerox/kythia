/**
 * @namespace: addons/core/commands/utils/cache.js
 * @type: Command
 * @copyright © 2025 kenndeclouv
 * @assistant chaa & graa
 * @version 0.9.10-beta
 */

const { SlashCommandBuilder, EmbedBuilder, InteractionContextType } = require('discord.js');
const { KythiaModel } = require('@kenndeclouv/kythia-core');
const { embedFooter } = require('@coreHelpers/discord');

module.exports = {
    data: new SlashCommandBuilder().setName('cache').setDescription('Shows cache statistics.').setContexts(InteractionContextType.BotDM),
    ownerOnly: true,
    async execute(interaction) {
        const stats = KythiaModel.cacheStats;
        const embed = new EmbedBuilder()
            .setDescription('## 📊 Cache Engine Statistics')
            .setColor(kythia.bot.color)
            .addFields(
                { name: 'Redis Hits', value: stats.redisHits.toString(), inline: false },
                { name: 'In-Memory Hits', value: stats.mapHits.toString(), inline: false },
                { name: 'Cache Misses', value: stats.misses.toString(), inline: false },
                { name: 'Cache Sets', value: stats.sets.toString(), inline: false },
                { name: 'Cache Clears', value: stats.clears.toString(), inline: false },
                { name: 'Redis Connected', value: KythiaModel.isRedisConnected ? '✅ Yes' : '❌ No', inline: false }
            )
            .setFooter(await embedFooter(interaction));
        await interaction.reply({ embeds: [embed] });
    },
};
