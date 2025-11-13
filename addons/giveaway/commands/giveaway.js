/**
 * @namespace: addons/giveaway/commands/giveaway.js
 * @type: Command
 * @copyright © 2025 kenndeclouv
 * @assistant chaa & graa
 * @version 0.9.12-beta
 */
const {
    SlashCommandBuilder,
    EmbedBuilder,
    WebhookClient,
    PermissionFlagsBits,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    InteractionContextType,
} = require('discord.js');
const { announceWinners } = require('../helpers/giveawayManager');
const Giveaway = require('../database/models/Giveaway');
const { parseDuration } = require('@coreHelpers/time');
const { t } = require('@coreHelpers/translator');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('giveaway')
        .setDescription('🎉 Create a giveaway event to your members')
        .addSubcommand((subcommand) =>
            subcommand
                .setName('start')
                .setDescription('Start a giveaway')
                .addStringOption((option) =>
                    option.setName('duration').setDescription('Duration (e.g. 1 week 4 days 12 minutes)').setRequired(true)
                )
                .addIntegerOption((option) => option.setName('winners').setDescription('Number of winners').setRequired(true))
                .addStringOption((option) => option.setName('prize').setDescription('Prize for the giveaway').setRequired(true))
                .addStringOption((option) =>
                    option.setName('color').setDescription('Embed color (hex code or color name)').setRequired(false)
                )
                .addRoleOption((option) => option.setName('role').setDescription('Role required to join').setRequired(false))
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName('end')
                .setDescription('End a giveaway')
                .addStringOption((option) => option.setName('message_id').setDescription('Message ID of the giveaway').setRequired(true))
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName('cancel')
                .setDescription('Cancel a giveaway')
                .addStringOption((option) => option.setName('message_id').setDescription('Message ID of the giveaway').setRequired(true))
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName('reroll')
                .setDescription('Reroll giveaway winners')
                .addStringOption((option) => option.setName('message_id').setDescription('Message ID of the giveaway').setRequired(true))
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
        .setContexts(InteractionContextType.Guild),
    permissions: PermissionFlagsBits.ManageGuild,
    botPermissions: PermissionFlagsBits.SendMessages,
    async execute(interaction) {
        await interaction.deferReply();
        const subcommand = interaction.options.getSubcommand();

        switch (subcommand) {
            case 'start':
                await startGiveaway(interaction);
                break;
            case 'end':
                await endGiveaway(interaction);
                break;
            case 'cancel':
                await cancelGiveaway(interaction);
                break;
            case 'reroll':
                await rerollGiveaway(interaction);
                break;
            default: {
                const embed = new EmbedBuilder()
                    .setColor('Red')
                    .setDescription(
                        `${await t(interaction, 'giveaway.giveaway.unknown.subcommand.title')}\n${await t(interaction, 'giveaway.giveaway.unknown.subcommand.desc')}`
                    );
                await interaction.editReply({ embeds: [embed], ephemeral: true });
            }
        }
    },
};

async function startGiveaway(interaction) {
    const durationInput = interaction.options.getString('duration');
    const winners = interaction.options.getInteger('winners');
    const prize = interaction.options.getString('prize');
    const color = interaction.options.getString('color') || 'Random';
    const role = interaction.options.getRole('role');

    // Validate duration
    const durationMs = parseDuration(durationInput);
    if (!durationMs || durationMs <= 0 || isNaN(durationMs)) {
        const errorEmbed = new EmbedBuilder()
            .setColor('Red')
            .setDescription(
                `${await t(interaction, 'giveaway.giveaway.invalid.duration.title')}\n${await t(interaction, 'giveaway.giveaway.invalid.duration.desc')}`
            );
        return interaction.editReply({ embeds: [errorEmbed], ephemeral: true });
    }

    const endTime = Date.now() + durationMs;
    const endTimestamp = Math.floor(endTime / 1000);

    const embed = new EmbedBuilder()
        .setColor(color)
        .setDescription(
            `${await t(interaction, 'giveaway.helpers.giveawayManager.embed.title')}\n` +
                `${await t(interaction, 'giveaway.helpers.giveawayManager.embed.desc', {
                    prize: prize,
                    endRelative: `<t:${endTimestamp}:R>`,
                    endFull: `<t:${endTimestamp}:F>`,
                    host: interaction.user,
                })}`
        )
        .addFields(
            { name: await t(interaction, 'giveaway.helpers.giveawayManager.field.winners'), value: `🏆 ${winners}`, inline: true },
            { name: await t(interaction, 'giveaway.helpers.giveawayManager.field.participants'), value: '👥 0', inline: true }
        )
        // .setImage("https://i.ibb.co/Y0C1Zcw/tenor.gif")
        .setFooter({ text: await t(interaction, 'giveaway.giveaway.embed.footer.starting') });

    if (role) {
        embed.addFields({
            name: await t(interaction, 'giveaway.helpers.giveawayManager.field.role.requirement'),
            value: `${role}`,
            inline: true,
        });
    }

    const button = new ButtonBuilder()
        .setCustomId('giveawayjoin')
        .setLabel(await t(interaction, 'giveaway.giveaway.button.join'))
        .setStyle(ButtonStyle.Success)
        .setEmoji('🎉');

    const row = new ActionRowBuilder().addComponents(button);

    try {
        const message = await interaction.channel.send({
            content: role ? `${role}` : '@everyone',
            embeds: [embed],
            components: [row],
        });

        // Save to database
        await Giveaway.create({
            messageId: message.id,
            channelId: interaction.channel.id,
            guildId: interaction.guild.id,
            hostId: interaction.user.id,
            duration: durationMs,
            endTime: new Date(endTime),
            winners: winners,
            prize: prize,
            participants: '[]',
            ended: false,
            roleId: role?.id || null,
            color: color,
        });

        // Update footer after message ID is available
        embed.setFooter({ text: await t(interaction, 'giveaway.helpers.giveawayManager.embed.footer.id', { id: message.id }) });
        await message.edit({ embeds: [embed] });

        const successEmbed = new EmbedBuilder()
            .setColor('Green')
            .setDescription(
                `${await t(interaction, 'giveaway.giveaway.start.success.title')}\n${await t(interaction, 'giveaway.giveaway.start.success.desc')}`
            );
        await interaction.editReply({ embeds: [successEmbed], ephemeral: true });
    } catch (error) {
        console.error('Failed to create giveaway:', error);
        const errorEmbed = new EmbedBuilder()
            .setColor('Red')
            .setDescription(
                `${await t(interaction, 'giveaway.helpers.giveawayManager.fatal.error.title')}\n${await t(interaction, 'giveaway.helpers.giveawayManager.fatal.error.desc')}`
            );
        await interaction.editReply({ embeds: [errorEmbed], ephemeral: true });
    }
}

async function endGiveaway(interaction) {
    await interaction.deferReply({ ephemeral: true });
    const messageId = interaction.options.getString('message_id');
    const giveaway = await Giveaway.getCache({ messageId });

    if (!giveaway || giveaway.ended) {
        const embed = new EmbedBuilder()
            .setColor('Red')
            .setDescription(
                `${await t(interaction, 'giveaway.giveaway.not.found.title')}\n${await t(interaction, 'giveaway.giveaway.not.found.desc')}`
            );
        return interaction.editReply({ embeds: [embed], ephemeral: true });
    }

    await announceWinners(interaction.client, giveaway);
    const embed = new EmbedBuilder()
        .setColor('Green')
        .setDescription(
            `${await t(interaction, 'giveaway.giveaway.end.success.title')}\n${await t(interaction, 'giveaway.giveaway.end.success.desc')}`
        );
    await interaction.editReply({ embeds: [embed], ephemeral: true });
}

async function rerollGiveaway(interaction) {
    await interaction.deferReply({ ephemeral: true });
    const messageId = interaction.options.getString('message_id');
    const giveaway = await Giveaway.getCache({ messageId });

    if (!giveaway) {
        const embed = new EmbedBuilder()
            .setColor('Red')
            .setDescription(
                `${await t(interaction, 'giveaway.giveaway.not.found.title')}\n${await t(interaction, 'giveaway.giveaway.not.found.desc')}`
            );
        return interaction.editReply({ embeds: [embed], ephemeral: true });
    }
    if (!giveaway.ended) {
        const embed = new EmbedBuilder()
            .setColor('Red')
            .setDescription(
                `${await t(interaction, 'giveaway.giveaway.not.ended.title')}\n${await t(interaction, 'giveaway.giveaway.not.ended.desc')}`
            );
        return interaction.editReply({ embeds: [embed], ephemeral: true });
    }

    await announceWinners(interaction.client, giveaway, true);
    const embed = new EmbedBuilder()
        .setColor('Green')
        .setDescription(
            `${await t(interaction, 'giveaway.giveaway.reroll.success.title')}\n${await t(interaction, 'giveaway.giveaway.reroll.success.desc')}`
        );
    await interaction.editReply({ embeds: [embed], ephemeral: true });
}

async function cancelGiveaway(interaction) {
    const messageId = interaction.options.getString('message_id');
    const giveaway = await Giveaway.getCache({ where: { messageId } });

    if (!giveaway || giveaway.ended) {
        const embed = new EmbedBuilder()
            .setColor('Red')
            .setDescription(
                `${await t(interaction, 'giveaway.giveaway.not.found.title')}\n${await t(interaction, 'giveaway.giveaway.not.found.desc')}`
            );
        return interaction.editReply({ embeds: [embed], ephemeral: true });
    }

    giveaway.ended = true;
    await giveaway.saveAndUpdateCache('messageId');

    const embed = new EmbedBuilder()
        .setColor('DarkRed')
        .setDescription(
            `${await t(interaction, 'giveaway.giveaway.cancelled.title', { prize: giveaway.prize })}\n${await t(interaction, 'giveaway.giveaway.cancelled.desc', { user: interaction.user })}`
        )
        .setTimestamp();

    const channel = await interaction.client.channels.fetch(giveaway.channelId);
    const message = await channel.messages.fetch(giveaway.messageId);

    const disabledButton = new ButtonBuilder()
        .setCustomId('giveawayjoin')
        .setLabel(await t(interaction, 'giveaway.giveaway.button.cancelled'))
        .setStyle(ButtonStyle.Danger)
        .setEmoji('❌')
        .setDisabled(true);
    const row = new ActionRowBuilder().addComponents(disabledButton);

    await message.edit({ embeds: [embed], components: [row] });

    const replyEmbed = new EmbedBuilder()
        .setColor('Green')
        .setDescription(
            `${await t(interaction, 'giveaway.giveaway.cancel.success.title')}\n${await t(interaction, 'giveaway.giveaway.cancel.success.desc')}`
        );
    await interaction.editReply({ embeds: [replyEmbed], ephemeral: true });
}
