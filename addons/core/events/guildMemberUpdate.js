/**
 * @namespace: addons/core/events/guildMemberUpdate.js
 * @type: Event Handler
 * @copyright © 2025 kenndeclouv
 * @assistant chaa & graa
 * @version 0.9.9-beta-rc.4
 */

const { resolvePlaceholders, safeResolvePlaceholder } = require('@coreHelpers/stats');
const ServerSetting = require('../database/models/ServerSetting');
const { EmbedBuilder } = require('discord.js');
const { embedFooter } = require('@utils/discord');
const { rolePrefix } = require('../helpers');

module.exports = async (bot, oldMember, newMember) => {
    const guild = newMember.guild;
    const guildId = guild.id;

    const setting = await ServerSetting.getCache({ guildId: guildId });
    if (!setting || !setting.boostLogOn) return;

    const channel = guild.channels.cache.get(setting.boostLogChannelId);
    if (!channel) return;

    if (setting.rolePrefixOn) {
        await rolePrefix(newMember.guild);
    }

    const statsData = {
        userId: newMember.user.id,
        tag: newMember.user.tag,
        username: newMember.user.username,
        userTag: newMember.user.id,
        guildName: guild.name,
        guildId: guild.id,
        ownerName: guild.members.cache.get(guild.ownerId)?.user?.tag || 'Unknown',
        ownerId: guild.ownerId,
        region: guild.preferredLocale,
        createdAt: guild.createdAt,
        boosts: guild.premiumSubscriptionCount || 0,
        boostLevel: guild.premiumTier || 0,
        members: guild.memberCount,
        roles: guild.roles.cache.size,
        emojis: guild.emojis.cache.size,
        stickers: guild.stickers.cache.size,
        memberJoin: newMember.joinedAt,
        online: guild.members.cache.filter((m) => m.presence?.status === 'online').size,
        idle: guild.members.cache.filter((m) => m.presence?.status === 'idle').size,
        dnd: guild.members.cache.filter((m) => m.presence?.status === 'dnd').size,
        offline: guild.members.cache.filter((m) => !m.presence || m.presence.status === 'offline').size,
        bots: guild.members.cache.filter((m) => m.user.bot).size,
        humans: guild.members.cache.filter((m) => !m.user.bot).size,
        onlineBots: guild.members.cache.filter((m) => m.user.bot && m.presence && m.presence.status !== 'offline').size,
        onlineHumans: guild.members.cache.filter((m) => !m.user.bot && m.presence && m.presence.status !== 'offline').size,
        channels: guild.channels.cache.size,
        textChannels: guild.channels.cache.filter((c) => c.type === 0 || c.type === 'GUILD_TEXT').size,
        voiceChannels: guild.channels.cache.filter((c) => c.type === 2 || c.type === 'GUILD_VOICE').size,
        categories: guild.channels.cache.filter((c) => c.type === 4 || c.type === 'GUILD_CATEGORY').size,
        announcementChannels: guild.channels.cache.filter((c) => c.type === 5 || c.type === 'GUILD_ANNOUNCEMENT').size,
        stageChannels: guild.channels.cache.filter((c) => c.type === 13 || c.type === 'GUILD_STAGE_VOICE').size,
        verified: guild.verified,
        partnered: guild.partnered,
        membersTotal: guild.members.cache.size,
        displayName: newMember.displayName,
        premiumSince: newMember.premiumSince,
    };

    if (!oldMember.premiumSince && newMember.premiumSince) {
        let messageText = setting.boostLogMessage;
        if (!messageText || typeof messageText !== 'string' || !messageText.trim()) {
            messageText = `Thank you so much, **${newMember.displayName}**! Thanks to you, our server just got even cooler!`;
        } else {
            messageText = await safeResolvePlaceholder(
                newMember,
                messageText,
                statsData,
                `Thank you so much, **${newMember.displayName}**! Thanks to you, our server just got even cooler!`
            );
        }

        const embed = new EmbedBuilder()
            .setColor(kythia.bot.color)
            .setDescription(messageText)
            .setThumbnail(newMember.user.displayAvatarURL({ dynamic: true }))
            .setFooter(await embedFooter(newMember))
            .setTimestamp();

        channel.send({ embeds: [embed] });
    }
};
