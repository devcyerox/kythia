/**
 * @namespace: addons/ticket/helpers/index.js
 * @type: Helper Script
 * @copyright © 2025 kenndeclouv
 * @assistant chaa & graa
 * @version 0.9.12-beta
 */

const {
    EmbedBuilder,
    ChannelType,
    PermissionsBitField,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ContainerBuilder,
    TextDisplayBuilder,
    SeparatorBuilder,
    SeparatorSpacingSize,
    StringSelectMenuBuilder,
    MessageFlags,
    FileBuilder,
    AttachmentBuilder,
} = require('discord.js');

async function refreshTicketPanel(panelMessageId, container) {
    const { models, kythiaConfig, helpers } = container;
    const { TicketPanel, TicketConfig } = models;
    const { convertColor } = helpers.color;

    try {
        const panel = await TicketPanel.getCache({ messageId: panelMessageId });
        if (!panel) throw new Error(`Panel dengan messageId ${panelMessageId} tidak ditemukan.`);

        const allTypes = await TicketConfig.getAllCache({ panelMessageId: panelMessageId });
        if (!allTypes || allTypes.length === 0) {
            return;
        }

        const channel = await container.client.channels.fetch(panel.channelId).catch(() => null);
        if (!channel) throw new Error(`Channel ${panel.channelId} tidak ditemukan.`);
        const message = await channel.messages.fetch(panel.messageId).catch(() => null);
        if (!message) throw new Error(`Pesan ${panel.messageId} tidak ditemukan.`);

        const accentColor = convertColor(kythiaConfig.bot.color, { from: 'hex', to: 'decimal' });
        const panelComponents = [
            new ContainerBuilder()
                .setAccentColor(accentColor)
                .addTextDisplayComponents(new TextDisplayBuilder().setContent(panel.title))
                .addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true))
                .addTextDisplayComponents(new TextDisplayBuilder().setContent(panel.description || '...'))
                .addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(false)),
        ];

        let actionRow;

        if (allTypes.length === 1) {
            const type = allTypes[0];
            actionRow = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setCustomId(`ticket-create:${type.id}`)
                    .setLabel(type.typeName)
                    .setStyle(ButtonStyle.Secondary)
                    .setEmoji(type.typeEmoji || '🎫')
            );
        } else {
            const options = allTypes.map((type) => ({
                label: type.typeName,

                value: type.id.toString(),
                emoji: type.typeEmoji || '🎫',
            }));

            actionRow = new ActionRowBuilder().addComponents(
                new StringSelectMenuBuilder().setCustomId('ticket-select').setPlaceholder('Pilih satu tipe tiket...').setOptions(options)
            );
        }

        panelComponents[0].addActionRowComponents(actionRow);

        await message.edit({
            components: panelComponents,
            flags: MessageFlags.IsPersistent | MessageFlags.IsComponentsV2,
        });
    } catch (error) {
        console.error(`🔴 GAGAL REFRESH PANEL (${panelMessageId}):`, error);
    }
}

async function createTicketChannel(interaction, ticketConfig, container) {
    const { models, t, kythiaConfig, helpers } = container;
    const { Ticket } = models;
    const { simpleContainer } = helpers.discord;

    try {
        const existingTicket = await Ticket.getCache({
            userId: interaction.user.id,
            guildId: interaction.guild.id,
            ticketConfigId: ticketConfig.id,
            status: 'open',
        });

        if (existingTicket) {
            const desc = await t(interaction, 'ticket.errors.already_open', { channelId: existingTicket.channelId });
            return interaction.reply({
                components: await simpleContainer(interaction, desc, { color: 'Red' }),
                flags: MessageFlags.IsComponentsV2 | MessageFlags.Ephemeral,
            });
        }

        const username = interaction.user.username
            .toLowerCase()
            .replace(/[^a-z0-9]/g, '')
            .slice(0, 8);
        const channelName = `${ticketConfig.typeName.toLowerCase().replace(' ', '-')}-${username}`;

        const ticketChannel = await interaction.guild.channels.create({
            name: channelName,
            type: ChannelType.GuildText,
            parent: ticketConfig.ticketCategoryId || null,
            permissionOverwrites: [
                { id: interaction.guild.id, deny: [PermissionsBitField.Flags.ViewChannel] },
                { id: interaction.user.id, allow: [PermissionsBitField.Flags.ViewChannel] },
                { id: ticketConfig.staffRoleId, allow: [PermissionsBitField.Flags.ViewChannel] },
            ],
        });

        const openMessage = (
            ticketConfig.ticketOpenMessage || `Halo {user}, staff <@&${ticketConfig.staffRoleId}> akan segera membantumu.`
        ).replace('{user}', interaction.user.toString());

        const openEmbed = new EmbedBuilder()
            .setColor(kythiaConfig.bot.color || 0x5865f2)
            .setTitle(`Selamat Datang di Tiket: ${ticketConfig.typeName}`)
            .setDescription(openMessage)
            .setImage(ticketConfig.ticketOpenImage || null)
            .setTimestamp();

        const closeButton = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId('ticket-close').setLabel('Tutup Tiket').setStyle(ButtonStyle.Danger).setEmoji('🔒')
        );

        await ticketChannel.send({
            content: `<@&${ticketConfig.staffRoleId}> ${interaction.user.toString()}`,
            embeds: [openEmbed],
            components: [closeButton],
        });

        await Ticket.create({
            guildId: interaction.guild.id,
            userId: interaction.user.id,
            channelId: ticketChannel.id,
            ticketConfigId: ticketConfig.id,
            status: 'open',
            openedAt: Date.now(),
        });

        const descSuccess = await t(interaction, 'ticket.create.success', {
            ticketChannel: ticketChannel.toString(),
        });

        await interaction.reply({
            components: await simpleContainer(interaction, descSuccess, { color: 'Green' }),
            flags: MessageFlags.IsComponentsV2 | MessageFlags.Ephemeral,
        });
    } catch (error) {
        console.error('Error di createTicketChannel helper:', error);

        const descError = await t(interaction, 'ticket.errors.create_failed');
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp({
                components: await simpleContainer(interaction, descError, { color: 'Red' }),
                flags: MessageFlags.IsComponentsV2 | MessageFlags.Ephemeral,
            });
        } else {
            await interaction.reply({
                components: await simpleContainer(interaction, descError, { color: 'Red' }),
                flags: MessageFlags.IsComponentsV2 | MessageFlags.Ephemeral,
            });
        }
    }
}

async function createTicketTranscript(channel, container) {
    const { kythiaConfig } = container;
    const locale = kythiaConfig.bot.locale || 'en-US';
    const timezone = kythiaConfig.bot.timezone || 'UTC';

    const messages = await channel.messages.fetch();
    let transcriptText = '';

    messages.reverse().forEach((msg) => {
        const time = msg.createdAt.toLocaleString(locale, { timeZone: timezone });
        transcriptText += `${time} - ${msg.author.tag}: ${msg.content}\n`;
    });

    return transcriptText;
}

async function closeTicket(interaction, container) {
    const { models, t, helpers, kythiaConfig } = container;
    const { Ticket, TicketConfig } = models;
    const { simpleContainer } = helpers.discord;
    const { convertColor } = helpers.color;

    try {
        const ticket = await Ticket.getCache({
            channelId: interaction.channel.id,
            status: 'open',
        });
        if (!ticket) {
            const desc = await t(interaction, 'ticket.errors.not_a_ticket');
            return interaction.reply({
                components: await simpleContainer(interaction, desc, { color: 'Red' }),
                flags: MessageFlags.IsComponentsV2 | MessageFlags.Ephemeral,
            });
        }

        const ticketConfig = await TicketConfig.getCache({ id: ticket.ticketConfigId });
        if (!ticketConfig) {
            const desc = await t(interaction, 'ticket.errors.config_missing');
            return interaction.reply({
                components: await simpleContainer(interaction, desc, { color: 'Red' }),
                flags: MessageFlags.IsComponentsV2 | MessageFlags.Ephemeral,
            });
        }

        const logsChannel = interaction.guild.channels.cache.get(ticketConfig.logsChannelId);
        const transcriptChannel = interaction.guild.channels.cache.get(ticketConfig.transcriptChannelId);

        if (!transcriptChannel) {
            const desc = await t(interaction, 'ticket.errors.transcript_channel_missing', { channelId: ticketConfig.transcriptChannelId });
            return interaction.reply({
                components: await simpleContainer(interaction, desc, { color: 'Red' }),
                flags: MessageFlags.IsComponentsV2 | MessageFlags.Ephemeral,
            });
        }

        await interaction.reply({
            content: await t(interaction, 'ticket.close.thinking'),
            ephemeral: true,
        });

        const transcriptText = await createTicketTranscript(interaction.channel, container);
        const filename = `transcript-${ticket.id}.txt`;
        const transcriptBuffer = Buffer.from(transcriptText, 'utf-8');

        const accentColor = convertColor(kythiaConfig.bot.color, { from: 'hex', to: 'decimal' });

        const title = await t(interaction, 'ticket.transcript.title', {
            ticketId: ticket.id,
            typeName: ticketConfig.typeName,
        });
        const userLine = await t(interaction, 'ticket.transcript.user', { userId: ticket.userId });
        const footerText = await t(interaction, 'common.container.footer', {
            username: interaction.client.user.username,
        });
        const attachment = new AttachmentBuilder(transcriptBuffer)
            .setName(filename)
            .setDescription(`Transcript for ticket #${ticket.id} (${ticketConfig.typeName})`);
        const fileComponent = new FileBuilder().setURL(`attachment://${filename}`).setSpoiler(false);

        const v2Components = [
            new ContainerBuilder()
                .setAccentColor(accentColor)
                .addTextDisplayComponents(new TextDisplayBuilder().setContent(title))
                .addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true))
                .addTextDisplayComponents(new TextDisplayBuilder().setContent(userLine))
                .addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(false))
                .addFileComponents(fileComponent)
                .addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true))
                .addTextDisplayComponents(new TextDisplayBuilder().setContent(footerText)),
        ];

        await transcriptChannel.send({
            components: v2Components,
            files: [attachment],
            flags: MessageFlags.IsPersistent | MessageFlags.IsComponentsV2,
        });

        if (logsChannel) {
            const logDesc = `## 🔒 Ticket #${ticket.id} Closed\n**Ticket Type:** ${ticketConfig.typeName}\n**Opened By:** <@${ticket.userId}>\n**Opened At:** ${ticket.openedAt} \n**Closed By:** <@${interaction.user.id}>.`;
            await logsChannel.send({
                components: await simpleContainer(interaction, logDesc),
                flags: MessageFlags.IsComponentsV2,
            });
        }

        ticket.status = 'closed';
        ticket.closedAt = Date.now();
        ticket.closedByUserId = interaction.user.id;

        await ticket.saveAndUpdateCache();

        await interaction.channel.delete();
    } catch (error) {
        console.error('Failed to close ticket:', error);

        const descError = await t(interaction, 'ticket.errors.close_failed');
        if (!interaction.replied && !interaction.deferred) {
            await interaction.reply({
                components: await simpleContainer(interaction, descError, { color: 'Red' }),
                flags: MessageFlags.IsComponentsV2 | MessageFlags.Ephemeral,
            });
        } else {
            await interaction.followUp({
                components: await simpleContainer(interaction, descError, { color: 'Red' }),
                flags: MessageFlags.IsComponentsV2 | MessageFlags.Ephemeral,
            });
        }
    }
}

module.exports = {
    refreshTicketPanel,
    createTicketChannel,
    createTicketTranscript,
    closeTicket,
};
