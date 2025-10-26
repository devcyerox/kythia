/**
 * @namespace: addons/core/events/guildCreate.js
 * @type: Event Handler
 * @copyright © 2025 kenndeclouv
 * @assistant chaa & graa
 * @version 0.9.9-beta-rc.5
 */

const { Events, EmbedBuilder, WebhookClient, PermissionsBitField } = require('discord.js');
const ServerSetting = require('@coreModels/ServerSetting');
const { embedFooter } = require('@utils/discord');
const { t } = require('@utils/translator');

function safeWebhookClient(url) {
    if (typeof url === 'string' && url.trim().length > 0) {
        return new WebhookClient({ url });
    }
    return null;
}

async function getInviteLink(guild) {
    if (guild.vanityURLCode) {
        return `https://discord.gg/${guild.vanityURLCode}`;
    }

    try {
        const channels = guild.channels.cache.filter((ch) => ch.type === 0 || ch.type === 2 || ch.type === 5);

        let existingInvites = [];
        try {
            existingInvites = await guild.invites.fetch();
            if (existingInvites && existingInvites.size > 0) {
                const useable = existingInvites.find((i) => !i.expired && i.url);
                if (useable) return useable.url;

                const anyInvite = existingInvites.first();
                if (anyInvite) return anyInvite.url;
            }
        } catch (err) {}

        for (const channel of channels.values()) {
            const perms = channel.permissionsFor(guild.members.me);
            if (perms && perms.has(PermissionsBitField.Flags.CreateInstantInvite)) {
                try {
                    const invite = await channel.createInvite({
                        maxAge: 0,
                        maxUses: 0,
                        reason: 'Bot joined - sharing server invite for logging',
                    });
                    if (invite && invite.url) {
                        return invite.url;
                    }
                } catch (e) {}
            }
        }
    } catch (e) {}

    return null;
}

module.exports = async (bot, guild) => {
    const locale = guild.preferredLocale || 'en';
    const [setting, created] = await ServerSetting.findOrCreateWithCache({
        where: { guildId: guild.id },
        defaults: {
            guildId: guild.id,
            guildName: guild.name ?? 'Unknown',
            lang: locale,
        },
    });
    if (created) {
        console.log(`Default bot settings created for server: ${guild.name}`);
    }

    const webhookClient = safeWebhookClient(kythia.api.webhookGuildInviteLeave);

    let ownerName = 'Unknown';
    try {
        let owner = guild.members?.cache?.get(guild.ownerId);
        if (!owner && typeof guild.fetchOwner === 'function') {
            owner = await guild.fetchOwner();
        }
        if (owner && owner.user && owner.user.username) {
            ownerName = owner.user.username;
        }
    } catch (e) {}

    let inviteUrl = await getInviteLink(guild);
    let inviteText;
    if (inviteUrl) {
        inviteText = inviteUrl;
    } else {
        inviteText = await t(guild, 'core.events.guildCreate.events.guild.create.no.invite');
    }

    const inviteEmbed = new EmbedBuilder()
        .setColor(kythia.bot.color)
        .setDescription(
            await t(guild, 'core.events.guildCreate.events.guild.create.webhook.desc', {
                bot: guild.client.user.username,
                guild: guild.name,
                guildId: guild.id,
                ownerId: guild.ownerId,
                ownerName: ownerName,
                memberCount: guild.memberCount ?? '?',
                invite: inviteText,
                createdAt: guild.createdAt.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
            })
        )
        .setThumbnail(guild.iconURL({ dynamic: true }))
        .setFooter(await embedFooter(guild))
        .setTimestamp();

    if (webhookClient) {
        webhookClient
            .send({
                embeds: [inviteEmbed],
            })
            .catch(console.error);
    }

    const channel = guild.systemChannel;
    if (channel) {
        try {
            const welcomeEmbed = new EmbedBuilder()
                .setColor(kythia.bot.color)
                .setDescription(
                    await t(guild, 'core.events.guildCreate.events.guild.create.welcome.desc', {
                        bot: guild.client.user.username,
                    })
                )
                .setThumbnail(guild.client.user.displayAvatarURL())
                .setFooter(await embedFooter(guild))
                .setTimestamp();

            await channel.send({ embeds: [welcomeEmbed] });
        } catch (e) {
            channel.send(
                await t(guild, 'core.events.guildCreate.events.guild.create.welcome.fallback', {
                    bot: guild.client.user.username,
                })
            );
        }
    }
};
