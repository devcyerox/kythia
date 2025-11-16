/**
 * @namespace: addons/ticket/commands/ticket.js
 * @type: Command
 * @copyright © 2025 kenndeclouv
 * @assistant chaa & graa
 * @version 0.9.12-beta
 */

const {
    SlashCommandBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    EmbedBuilder,
    PermissionsBitField,
    PermissionFlagsBits,
    InteractionContextType,
    ModalBuilder,
    LabelBuilder,
    TextInputBuilder,
    TextInputStyle,
    ContainerBuilder,
    TextDisplayBuilder,
    SeparatorBuilder,
    SeparatorSpacingSize,
    ChannelSelectMenuBuilder,
    StringSelectMenuBuilder,
    ChannelType,
    MessageFlags,
    MediaGalleryBuilder,
    MediaGalleryItemBuilder,
    AttachmentBuilder,
    FileComponent,
    FileBuilder,
} = require('discord.js');

const { createTicketTranscript, closeTicket } = require('../helpers');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ticket')
        .setDescription('🎟️ Manage ticket system in your Discord server')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
        .setContexts(InteractionContextType.Guild)
        .addSubcommandGroup((group) =>
            group
                .setName('panel')
                .setDescription('Manage V2 ticket panels')
                .addSubcommand((subcommand) =>
                    subcommand.setName('create').setDescription('Creates a new V2 ticket panel (interactive setup)')
                )
        )
        .addSubcommandGroup((group) =>
            group
                .setName('type')
                .setDescription('Manage ticket types (e.g., "Report", "Ask")')
                .addSubcommand((subcommand) => subcommand.setName('create').setDescription('Creates a new ticket type (interactive setup)'))
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName('remove')
                .setDescription('Remove a user from the ticket channel')
                .addUserOption((option) => option.setName('user').setDescription('User to remove').setRequired(true))
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName('add')
                .setDescription('Add a user to the ticket channel')
                .addUserOption((option) => option.setName('user').setDescription('User to add').setRequired(true))
        )
        .addSubcommand((subcommand) => subcommand.setName('close').setDescription('Close the ticket and delete the ticket channel.'))
        .addSubcommand((subcommand) => subcommand.setName('transcript').setDescription('Get the transcript of the ticket.')),

    guildOnly: true,
    permissions: PermissionFlagsBits.ManageGuild,
    botPermissions: PermissionFlagsBits.ManageGuild,

    async execute(interaction, container) {
        const { models, t, kythiaConfig, redis, helpers } = container;
        const { Ticket, TicketConfig, TicketPanel } = models;
        const { convertColor } = helpers.color;
        const { simpleContainer } = helpers.discord;

        const group = interaction.options.getSubcommandGroup(false);
        const subcommand = interaction.options.getSubcommand();

        try {
            if (group === 'panel') {
                if (group === 'panel') {
                    if (subcommand === 'create') {
                        const accentColor = convertColor(kythiaConfig.bot.color, { from: 'hex', to: 'decimal' });

                        const startButton = new ButtonBuilder()
                            .setCustomId('tkt-panel-modal-show')
                            .setLabel(await t(interaction, 'ticket.panel.start_button'))
                            .setStyle(ButtonStyle.Primary)
                            .setEmoji('🎟️');

                        const components = [
                            new ContainerBuilder()
                                .setAccentColor(accentColor)
                                .addMediaGalleryComponents(
                                    new MediaGalleryBuilder().addItems([
                                        new MediaGalleryItemBuilder().setURL(kythiaConfig.settings.ticketBannerImage),
                                    ])
                                )
                                .addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true))
                                .addTextDisplayComponents(
                                    new TextDisplayBuilder().setContent(await t(interaction, 'ticket.panel.start_title'))
                                )
                                .addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true))
                                .addTextDisplayComponents(
                                    new TextDisplayBuilder().setContent(await t(interaction, 'ticket.panel.start_desc'))
                                )
                                .addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true))
                                .addActionRowComponents(new ActionRowBuilder().addComponents(startButton))
                                .addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true))
                                .addTextDisplayComponents(
                                    new TextDisplayBuilder().setContent(
                                        await t(interaction, 'common.container.footer', { username: interaction.client.user.username })
                                    )
                                ),
                        ];

                        await interaction.reply({
                            components: components,
                            flags: MessageFlags.IsPersistent | MessageFlags.IsComponentsV2,
                        });

                        return;
                    }
                }
            } else if (group === 'type') {
                if (subcommand === 'create') {
                    const cacheKey = `ticket:type-create:${interaction.guild.id}:${interaction.user.id}`;
                    const initialData = { step: 'panel', guildId: interaction.guild.id, userId: interaction.user.id };
                    await redis.set(cacheKey, JSON.stringify(initialData), 'EX', 1800);

                    const panels = await TicketPanel.getAllCache({ guildId: interaction.guild.id });

                    if (!panels || panels.length === 0) {
                        const desc = await t(interaction, 'ticket.errors.no_panels_found');
                        return interaction.reply({
                            components: await simpleContainer(interaction, desc, { color: 'Red' }),
                            flags: MessageFlags.IsComponentsV2 | MessageFlags.Ephemeral,
                        });
                    }

                    const panelOptions = panels.map((panel) => ({
                        label: panel.title.slice(0, 100),
                        description: `Panel in channel #${interaction.guild.channels.cache.get(panel.channelId)?.name || panel.channelId}`,
                        value: panel.messageId,
                    }));

                    const accentColor = convertColor(kythiaConfig.bot.color, { from: 'hex', to: 'decimal' });

                    const components = [
                        new ContainerBuilder()
                            .setAccentColor(accentColor)
                            .addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true))
                            .addTextDisplayComponents(new TextDisplayBuilder().setContent(await t(interaction, 'ticket.type.start_title')))
                            .addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true))
                            .addTextDisplayComponents(new TextDisplayBuilder().setContent(await t(interaction, 'ticket.type.start_desc')))
                            .addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true))
                            .addActionRowComponents(
                                new ActionRowBuilder().addComponents(
                                    new StringSelectMenuBuilder()
                                        .setCustomId('tkt-type-panel')
                                        .setPlaceholder(await t(interaction, 'ticket.type.select_panel_placeholder'))
                                        .setOptions(panelOptions)
                                )
                            )
                            .addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true))
                            .addTextDisplayComponents(
                                new TextDisplayBuilder().setContent(
                                    await t(interaction, 'common.container.footer', { username: interaction.client.user.username })
                                )
                            ),
                    ];

                    await interaction.reply({
                        components: components,
                        flags: MessageFlags.IsPersistent | MessageFlags.IsComponentsV2,
                    });

                    return;
                }
            } else {
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

                let ticketConfig;
                if (subcommand === 'close' || subcommand === 'transcript') {
                    ticketConfig = await TicketConfig.getCache({ id: ticket.ticketConfigId });
                    if (!ticketConfig) {
                        const desc = await t(interaction, 'ticket.errors.config_missing');
                        return interaction.reply({
                            components: await simpleContainer(interaction, desc, { color: 'Red' }),
                            flags: MessageFlags.IsComponentsV2 | MessageFlags.Ephemeral,
                        });
                    }
                }

                switch (subcommand) {
                    case 'remove': {
                        const user = interaction.options.getUser('user');
                        await interaction.channel.permissionOverwrites.edit(user.id, { ViewChannel: false });

                        const desc = await t(interaction, 'ticket.util.remove_success', {
                            userTag: user.tag,
                        });
                        return await interaction.reply({
                            components: await simpleContainer(interaction, desc, { color: 'Green' }),
                            flags: MessageFlags.IsComponentsV2 | MessageFlags.Ephemeral,
                        });
                    }

                    case 'add': {
                        const user = interaction.options.getUser('user');
                        await interaction.channel.permissionOverwrites.edit(user.id, { ViewChannel: true });

                        try {
                            const dmDesc = await t(interaction, 'ticket.ticket.dm', {
                                channel: `<#${interaction.channel.id}>`,
                                guild: interaction.guild.name,
                            });
                            await user.send({
                                components: await simpleContainer(interaction, dmDesc, { color: 'Blurple' }),
                            });
                        } catch (err) {
                            /* Ignore DM fail */
                        }

                        const desc = await t(interaction, 'ticket.util.add_success', {
                            userTag: user.tag,
                        });
                        return await interaction.reply({
                            components: await simpleContainer(interaction, desc, { color: 'Green' }),
                            flags: MessageFlags.IsComponentsV2 | MessageFlags.Ephemeral,
                        });
                    }

                    case 'close': {
                        await closeTicket(interaction, container);
                        return;
                    }

                    case 'transcript': {
                        const transcriptChannel = interaction.guild.channels.cache.get(ticketConfig.transcriptChannelId);

                        if (!transcriptChannel) {
                            const desc = await t(interaction, 'ticket.errors.transcript_channel_missing_cmd', {
                                channelId: ticketConfig.transcriptChannelId,
                            });
                            return interaction.reply({
                                components: await simpleContainer(interaction, desc, { color: 'Red' }),
                                flags: MessageFlags.IsComponentsV2 | MessageFlags.IsEphemeral,
                            });
                        }

                        try {
                            const transcriptText = await createTicketTranscript(interaction.channel, container);
                            let transcriptBuffer = Buffer.from(transcriptText, 'utf-8');
                            const maxTranscriptSize = 6 * 1024 * 1024;
                            if (transcriptBuffer.length > maxTranscriptSize) {
                                transcriptBuffer = transcriptBuffer.slice(0, maxTranscriptSize);
                            }

                            const filename = `transcript-${ticket.id}.txt`;

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

                            const desc = await t(interaction, 'ticket.util.transcript_success', {
                                channel: transcriptChannel.toString(),
                            });
                            return await interaction.reply({
                                components: await simpleContainer(interaction, desc, { color: 'Green' }),
                                flags: MessageFlags.IsComponentsV2 | MessageFlags.IsEphemeral,
                            });
                        } catch (error) {
                            console.error('Failed to create transcript:', error);
                            const desc = await t(interaction, 'ticket.errors.transcript_failed');
                            return interaction.reply({
                                components: await simpleContainer(interaction, desc, { color: 'Red' }),
                                flags: MessageFlags.IsComponentsV2 | MessageFlags.IsEphemeral,
                            });
                        }
                    }

                    default: {
                        const desc = await t(interaction, 'ticket.errors.unknown_subcommand');
                        return interaction.reply({
                            components: await simpleContainer(interaction, desc, { color: 'Red' }),
                            flags: MessageFlags.IsComponentsV2 | MessageFlags.Ephemeral,
                        });
                    }
                }
            }
        } catch (error) {
            console.error('Error in ticket command handler:', error);
            if (!interaction.replied && !interaction.deferred) {
                const desc = await t(interaction, 'ticket.errors.generic');
                await interaction.reply({
                    components: await simpleContainer(interaction, desc, { color: 'Red' }),
                    flags: MessageFlags.IsComponentsV2 | MessageFlags.Ephemeral,
                });
            }
        }
    },
};
