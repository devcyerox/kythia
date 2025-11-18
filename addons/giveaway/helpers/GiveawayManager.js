/**
 * @namespace: addons/giveaway/helpers/GiveawayManager.js
 * @type: Service/Manager
 * @copyright © 2025 kenndeclouv
 * @version 0.9.14-beta (FIXED SCHEDULER)
 */

const {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ContainerBuilder,
    TextDisplayBuilder,
    SeparatorBuilder,
    SeparatorSpacingSize,
    MessageFlags,
    ComponentType,
    SectionBuilder,
    ThumbnailBuilder,
} = require('discord.js');
const { Op } = require('sequelize');

class GiveawayManager {
    constructor(container) {
        const { client, logger, t, kythiaConfig, helpers } = container;

        this.container = container;
        this.client = client;
        this.logger = logger;
        this.t = t;
        this.config = kythiaConfig;

        // Helpers
        this.convertColor = helpers.color.convertColor;
        this.parseDuration = helpers.time.parseDuration;
        this.simpleContainer = helpers.discord.simpleContainer;

        // Scheduler Config
        this.CHECK_INTERVAL = (this.config.addons.giveaway.checkInterval || 20) * 1000;
    }

    // Getter Model (Lazy Load)
    get Giveaway() {
        return this.container.models.Giveaway;
    }

    /**
     * 🚀 Init Scheduler
     */
    async init() {
        // ... check model ...

        // Sync Scheduler via Model Method
        this.logger.info('🎁 Syncing Scheduler...');

        // Ambil semua active dari DB
        const active = await this.Giveaway.findAll({ where: { ended: false } });

        // Push ke Redis via Model wrapper
        // Kita pake 'active_schedule' sebagai suffix key
        for (const g of active) {
            const endSec = Math.floor(new Date(g.endTime).getTime() / 1000);
            await this.Giveaway.scheduleAdd('active_schedule', endSec, g.messageId);
        }

        this.startScheduler();
    }

    /**
     * ⏰ Scheduler Loop (Recursive Timeout)
     */
    async startScheduler() {
        try {
            await this.checkExpiredGiveaways();
        } catch (e) {
            this.logger.error('🎁 Giveaway Scheduler Error:', e);
        } finally {
            // Selalu jalanin lagi walaupun error
            setTimeout(() => this.startScheduler(), this.CHECK_INTERVAL);
        }
    }

    /**
     * 🔍 Check for expired giveaways in DB (FORCE DB HIT)
     */
    async checkExpiredGiveaways() {
        const nowSec = Math.floor(Date.now() / 1000);

        // Panggil Helper Model: Ambil ID yang expired
        // Ini hit ke Redis, bukan DB. Super cepet.
        const expiredIds = await this.Giveaway.scheduleGetExpired('active_schedule', nowSec);

        if (expiredIds && expiredIds.length > 0) {
            this.logger.info(`🎁 Found ${expiredIds.length} expired giveaways in Redis.`);

            for (const mid of expiredIds) {
                // 1. Hapus dari jadwal dulu (Atomic-like simulation)
                await this.Giveaway.scheduleRemove('active_schedule', mid);

                // 2. Baru ambil data detail dari DB/Cache biasa
                // Pake getCache biasa karena kita query by ID (messageId)
                const giveaway = await this.Giveaway.findOne({ where: { messageId: mid } });

                if (giveaway && !giveaway.ended) {
                    await this.endGiveaway(giveaway);
                }
            }
        }
    }

    // ========================================================
    // 🎮 CORE ACTIONS
    // ========================================================

    async createGiveaway(interaction) {
        await interaction.deferReply({ flags: MessageFlags.Ephemeral });
        const { options, user, guild, channel } = interaction;

        const durationInput = options.getString('duration');
        const winnersCount = options.getInteger('winners');
        const prize = options.getString('prize');
        const color = options.getString('color') || this.config.bot.color;
        const role = options.getRole('role');

        const durationMs = this.parseDuration(durationInput);
        if (!durationMs || durationMs <= 0 || isNaN(durationMs)) {
            const desc = await this.t(interaction, 'giveaway.giveaway.invalid.duration.desc');
            const errContainer = await this.simpleContainer(interaction, desc, {
                color: 'Red',
                title: await this.t(interaction, 'giveaway.giveaway.invalid.duration.title'),
            });
            return interaction.editReply({
                components: errContainer,
                flags: MessageFlags.IsComponentsV2 | MessageFlags.Ephemeral,
            });
        }

        const endTime = Date.now() + durationMs;
        const endTimestamp = Math.floor(endTime / 1000);

        const { container, components } = await this.buildGiveawayUI(interaction, {
            prize,
            endTime: endTimestamp, // Kirim timestamp (angka)
            hostId: user.id,
            winnersCount,
            participantsCount: 0,
            ended: false,
            color,
            roleId: role?.id,
        });

        try {
            const message = await channel.send({
                content: role ? `${role}` : null,
                components: [container],
                flags: MessageFlags.IsPersistent | MessageFlags.IsComponentsV2,
            });

            await message.edit({ components: [container, ...components] });

            await this.Giveaway.create({
                messageId: message.id,
                channelId: channel.id,
                guildId: guild.id,
                hostId: user.id,
                duration: durationMs,
                endTime: new Date(endTime),
                winners: winnersCount,
                prize: prize,
                participants: [],
                ended: false,
                roleId: role?.id || null,
                color: color,
            });

            await this.Giveaway.scheduleAdd('active_schedule', endTimestamp, message.id);

            const desc = await this.t(interaction, 'giveaway.giveaway.start.success.desc');
            const successContainer = await this.simpleContainer(interaction, desc, { color: 'Green' });
            await interaction.editReply({ components: successContainer, flags: MessageFlags.IsComponentsV2 });
        } catch (error) {
            this.logger.error('Failed to start giveaway:', error);
            const errContainer = await this.simpleContainer(interaction, error.message, { color: 'Red', title: 'Fatal Error' });
            await interaction.editReply({
                components: errContainer,
                flags: MessageFlags.IsComponentsV2 | MessageFlags.Ephemeral,
            });
        }
    }

    async endGiveaway(giveawayData, interaction = null) {
        let giveaway = giveawayData;

        // Support manual command trigger
        if (typeof giveawayData === 'string' || (interaction && !giveaway.prize)) {
            const messageId = interaction?.options.getString('message_id') || giveawayData;
            // Force DB fetch buat end manual juga biar akurat
            giveaway = await this.Giveaway.findOne({ where: { messageId } });
        }

        if (!giveaway || giveaway.ended) {
            if (interaction) {
                const desc = await this.t(interaction, 'giveaway.giveaway.not.found.desc');
                const err = await this.simpleContainer(interaction, desc, { color: 'Red', title: 'Error' });
                await interaction.reply({
                    components: err,
                    flags: MessageFlags.IsComponentsV2 | MessageFlags.Ephemeral,
                });
            }
            return;
        }

        // Safe Parsing Participants
        let participants = [];
        try {
            if (typeof giveaway.participants === 'string') {
                participants = JSON.parse(giveaway.participants);
            } else if (Array.isArray(giveaway.participants)) {
                participants = giveaway.participants;
            }
        } catch (e) {
            participants = [];
        }

        const winners = [];
        if (participants.length > 0) {
            const pool = [...participants];
            for (let i = 0; i < giveaway.winners; i++) {
                if (pool.length === 0) break;
                const index = Math.floor(Math.random() * pool.length);
                winners.push(pool[index]);
                pool.splice(index, 1);
            }
        }

        // Mark ended in DB
        giveaway.ended = true;
        await giveaway.save(); // save() biasa lebih aman buat update status critical

        // Announce
        const channel = await this.client.channels.fetch(giveaway.channelId).catch(() => null);
        if (channel) {
            const winnerMentions = winners.length > 0 ? winners.map((id) => `<@${id}>`).join(', ') : 'No valid entrants.';

            const announceContainer = new ContainerBuilder()
                .setAccentColor(this.convertColor('Gold', { from: 'discord', to: 'decimal' }))
                .addTextDisplayComponents(new TextDisplayBuilder().setContent(`## 🎉 CONGRATULATIONS!`))
                .addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true))
                .addTextDisplayComponents(
                    new TextDisplayBuilder().setContent(
                        await this.t(channel, 'giveaway.helpers.giveawayManager.announce.desc', {
                            winners: winnerMentions,
                            prize: giveaway.prize,
                            host: `<@${giveaway.hostId}>`,
                        })
                    )
                );

            await channel.send({ components: [announceContainer], flags: MessageFlags.IsPersistent | MessageFlags.IsComponentsV2 });

            // Update Message Asli (Button Disabled)
            const message = await channel.messages.fetch(giveaway.messageId).catch(() => null);
            if (message) {
                const { container, components } = await this.buildGiveawayUI(channel, {
                    prize: giveaway.prize,
                    endTime: Math.floor(new Date(giveaway.endTime).getTime() / 1000),
                    hostId: giveaway.hostId,
                    winnersCount: giveaway.winners,
                    participantsCount: participants.length,
                    ended: true,
                    color: giveaway.color,
                    roleId: giveaway.roleId,
                    winnerList: winnerMentions,
                });

                await message.edit({ components: [container, ...components] });
            }
        }

        if (interaction && !interaction.replied) {
            await interaction.reply({ content: '✅ Giveaway Ended.', ephemeral: true });
        }
    }

    // ========================================================
    // 🔘 BUTTON HANDLER (JOIN)
    // ========================================================

    async handleJoin(interaction) {
        await interaction.deferReply({ ephemeral: true });

        try {
            const messageId = interaction.message.id;
            // Pake noCache: true buat tombol join biar real-time
            const giveaway = await this.Giveaway.findOne({ where: { messageId } });

            if (!giveaway || giveaway.ended) {
                return interaction.editReply({ content: '❌ This giveaway has ended.' });
            }

            // Role Check
            if (giveaway.roleId && !interaction.member.roles.cache.has(giveaway.roleId)) {
                return interaction.editReply({ content: `🔒 You need the <@&${giveaway.roleId}> role to join.` });
            }

            // Safe Parsing Logic
            let participants = [];
            if (typeof giveaway.participants === 'string') {
                try {
                    participants = JSON.parse(giveaway.participants);
                } catch (e) {
                    participants = [];
                }
            } else if (Array.isArray(giveaway.participants)) {
                participants = giveaway.participants;
            }

            const userId = interaction.user.id;
            let message = '';

            // Toggle
            if (participants.includes(userId)) {
                participants = participants.filter((id) => id !== userId);
                message = '📤 You left the giveaway.';
            } else {
                participants.push(userId);
                message = '📥 You joined the giveaway!';
            }

            // Update DB
            giveaway.participants = participants;

            // Disini pake save() aja, karena changed() di Sequelize kadang tricky sama JSON array
            giveaway.changed('participants', true);
            await giveaway.save();

            // Update UI Counter
            try {
                const { container, components } = await this.buildGiveawayUI(interaction, {
                    prize: giveaway.prize,
                    endTime: Math.floor(new Date(giveaway.endTime).getTime() / 1000),
                    hostId: giveaway.hostId,
                    winnersCount: giveaway.winners,
                    participantsCount: participants.length,
                    ended: false,
                    color: giveaway.color,
                    roleId: giveaway.roleId,
                });

                await interaction.message.edit({ components: [container, ...components] });
            } catch (e) {
                this.logger.warn(`Failed to update UI for ${messageId}: ${e.message}`);
            }

            await interaction.editReply({ content: message });
        } catch (error) {
            this.logger.error('[GiveawayJoin] Fatal Error:', error);
            await interaction.editReply({ content: '❌ A fatal error occurred while joining.' });
        }
    }

    // ========================================================
    // 🎨 UI BUILDER (Container V2)
    // ========================================================

    async buildGiveawayUI(context, data) {
        const accentColor = this.convertColor(data.color || 'Blue', { from: 'hex', to: 'decimal' });

        const container = new ContainerBuilder()
            .setAccentColor(accentColor)
            .addTextDisplayComponents(new TextDisplayBuilder().setContent(`## 🎉 ${data.prize}`))
            .addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true));

        let desc = '';
        if (data.ended) {
            desc = `**Ended:** <t:${data.endTime}:R>\n**Hosted By:** <@${data.hostId}>\n**Winners:** ${data.winnerList || '...'}`;
        } else {
            desc = `**Ends:** <t:${data.endTime}:R> (<t:${data.endTime}:F>)\n**Hosted By:** <@${data.hostId}>\n**Winners:** ${data.winnersCount}`;
        }

        if (data.roleId) {
            desc += `\n**Requirement:** <@&${data.roleId}>`;
        }

        container.addTextDisplayComponents(new TextDisplayBuilder().setContent(desc));

        container.addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true));
        container.addTextDisplayComponents(new TextDisplayBuilder().setContent(`👥 **Participants:** ${data.participantsCount}`));

        // Footer
        container.addTextDisplayComponents(new TextDisplayBuilder().setContent(`Kythia Giveaway System`));

        // Button Row
        const joinBtn = new ButtonBuilder()
            .setCustomId('giveaway_join')
            .setLabel('Join Giveaway')
            .setStyle(ButtonStyle.Primary)
            .setEmoji('🎉')
            .setDisabled(data.ended);

        const row = new ActionRowBuilder().addComponents(joinBtn);

        return { container, components: [row] };
    }
}

module.exports = GiveawayManager;
