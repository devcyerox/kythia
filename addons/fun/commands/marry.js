/**
 * @namespace: addons/fun/commands/marry.js
 * @type: Command
 * @copyright © 2025 kenndeclouv
 * @assistant chaa & graa
 * @version 0.9.9-beta-rc.4
 */

const {
    SlashCommandBuilder,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    MessageFlags,
    ContainerBuilder,
    TextDisplayBuilder,
    SeparatorBuilder,
    MediaGalleryItemBuilder,
    MediaGalleryBuilder,
    SectionBuilder,
    ThumbnailBuilder,
    Embed,
} = require('discord.js');
const Marriage = require('../database/models/Marriage');
const { embedFooter } = require('@utils/discord');
const convertColor = require('@utils/color');
const { t } = require('@utils/translator');
const { Op } = require('sequelize');

const KISS_COOLDOWN = 3600000;
const divorceConfirmations = new Map();
const DIVORCE_CONFIRM_EXPIRE = 1000 * 60 * 2;

module.exports = {
    data: new SlashCommandBuilder()
        .setName('marry')
        .setDescription('💍 Marriage system commands')
        .addSubcommand((subcommand) =>
            subcommand
                .setName('propose')
                .setDescription('💍 Propose to another user')
                .addUserOption((option) => option.setName('user').setDescription('The user you want to propose to').setRequired(true))
        )
        .addSubcommand((subcommand) => subcommand.setName('divorce').setDescription('💔 End your current marriage'))
        .addSubcommand((subcommand) => subcommand.setName('kiss').setDescription('😘 Kiss your partner'))
        .addSubcommand((subcommand) => subcommand.setName('profile').setDescription('👰 View your marriage profile')),

    async execute(interaction) {
        const subcommand = interaction.options.getSubcommand();

        switch (subcommand) {
            case 'propose':
                await proposeMarriage(interaction);
                break;
            case 'divorce':
                await divorce(interaction);
                break;
            case 'kiss':
                await kiss(interaction);
                break;
            case 'profile':
                await viewProfile(interaction);
                break;
        }
    },
};

async function proposeMarriage(interaction) {
    const targetUser = interaction.options.getUser('user');
    const proposer = interaction.user;
    const proposerId = proposer.id;
    const targetId = targetUser.id;

    const existingMarriage = await Marriage.getCache({
        where: {
            [Op.or]: [
                { user1Id: proposerId, status: { [Op.in]: ['pending', 'married'] } },
                { user2Id: proposerId, status: { [Op.in]: ['pending', 'married'] } },
                { user1Id: targetId, status: { [Op.in]: ['pending', 'married'] } },
                { user2Id: targetId, status: { [Op.in]: ['pending', 'married'] } },
            ],
        },
    });

    if (existingMarriage) {
        return interaction.reply({
            content: await t(interaction, 'fun_marry_already_married'),
            ephemeral: true,
        });
    }

    if (targetUser.bot) {
        return interaction.reply({
            content: await t(interaction, 'fun_marry_bot_error'),
            ephemeral: true,
        });
    }

    if (targetId === proposerId) {
        return interaction.reply({
            content: await t(interaction, 'fun_marry_yourself_error'),
            ephemeral: true,
        });
    }

    const marriage = await Marriage.create({
        user1Id: proposerId,
        user2Id: targetId,
        status: 'pending',
    });

    const proposerAvatar = proposer.displayAvatarURL({ extension: 'png', size: 256 }) || 'https://cdn.discordapp.com/embed/avatars/0.png';
    const targetAvatar = targetUser.displayAvatarURL
        ? targetUser.displayAvatarURL({ extension: 'png', size: 256 })
        : 'https://cdn.discordapp.com/embed/avatars/0.png';

    const proposalTitle = `## ${await t(interaction, 'fun_marry_proposal_title')}`;
    const proposerBlock = `## ${proposer.username}\n-# ${proposerId}`;
    const targetBlock = `## ${targetUser.username}\n-# ${targetId}`;
    const proposalText = await t(interaction, 'fun_marry_proposal_description', {
        proposer: proposer.toString(),
        target: targetUser.toString(),
    });

    const acceptBtnLabel = await t(interaction, 'fun_marry_accept_button');
    const rejectBtnLabel = await t(interaction, 'fun_marry_reject_button');

    const container = new ContainerBuilder()
        .setAccentColor(convertColor(kythia.bot.color, { from: 'hex', to: 'decimal' }))
        .addTextDisplayComponents(new TextDisplayBuilder().setContent(proposalTitle))
        .addSeparatorComponents(new SeparatorBuilder().setDivider(true))
        .addSectionComponents(
            new SectionBuilder()
                .addTextDisplayComponents(new TextDisplayBuilder().setContent(proposerBlock))
                .setThumbnailAccessory(
                    proposerAvatar ? new ThumbnailBuilder().setURL(proposerAvatar).setDescription(proposer.username) : null
                )
        )
        .addSeparatorComponents(new SeparatorBuilder().setDivider(true))
        .addTextDisplayComponents(new TextDisplayBuilder().setContent(proposalText))
        .addSeparatorComponents(new SeparatorBuilder().setDivider(true))
        .addSectionComponents(
            new SectionBuilder()
                .addTextDisplayComponents(new TextDisplayBuilder().setContent(targetBlock))
                .setThumbnailAccessory(
                    targetAvatar ? new ThumbnailBuilder().setURL(targetAvatar).setDescription(targetUser.username) : null
                )
        )
        .addSeparatorComponents(new SeparatorBuilder().setDivider(true))
        .addActionRowComponents(
            new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setCustomId(`marry_accept_${marriage.id}`)
                    .setLabel(acceptBtnLabel)
                    .setEmoji('❤️')
                    .setStyle(ButtonStyle.Success),
                new ButtonBuilder()
                    .setCustomId(`marry_reject_${marriage.id}`)
                    .setLabel(rejectBtnLabel)
                    .setEmoji('❌')
                    .setStyle(ButtonStyle.Danger)
            )
        )
        .addSeparatorComponents(new SeparatorBuilder().setDivider(true))
        .addTextDisplayComponents(
            new TextDisplayBuilder().setContent(
                await t(interaction, 'common_container_footer', { username: interaction.client.user.username })
            )
        );

    await interaction.reply({
        flags: MessageFlags.IsPersistent | MessageFlags.IsComponentsV2,
        components: [container],
    });
}

async function divorce(interaction) {
    const userId = interaction.user.id;

    const marriage = await Marriage.getCache({
        where: {
            [Op.or]: [
                { user1Id: userId, status: 'married' },
                { user2Id: userId, status: 'married' },
            ],
        },
    });

    if (!marriage) {
        const embed = new EmbedBuilder()
            .setColor('Red')
            .setDescription(await t(interaction, 'fun_marry_not_married'))
            .setFooter(await embedFooter(interaction));
        return interaction.reply({
            embeds: [embed],
        });
    }

    const partnerId = marriage.user1Id === userId ? marriage.user2Id : marriage.user1Id;
    const key = [marriage.user1Id, marriage.user2Id].sort().join('-');
    const now = Date.now();

    let confirmation = divorceConfirmations.get(key);

    if (!confirmation || now - confirmation.startedAt > DIVORCE_CONFIRM_EXPIRE) {
        divorceConfirmations.set(key, {
            confirmedBy: new Set([userId]),
            startedAt: now,
        });

        let partner;
        try {
            partner = await interaction.client.users.fetch(partnerId);
        } catch {
            partner = null;
        }

        if (partner) {
            const embed = new EmbedBuilder()
                .setColor(kythia.bot.color)
                .setDescription(
                    await t(interaction, 'fun_marry_divorce_partner_confirm', {
                        partnerName: interaction.user.username,
                        serverName: interaction.guild ? interaction.guild.name : 'the server',
                    })
                )
                .setFooter(await embedFooter(interaction));
            partner
                .send({
                    embeds: [embed],
                })
                .catch(() => {});
        }

        const embed = new EmbedBuilder()
            .setColor('Red')
            .setDescription(
                await t(interaction, 'fun_marry_divorce_confirmation_needed', { partner: partner ? partner.tag : `ID: ${partnerId}` })
            )
            .setFooter(await embedFooter(interaction));
        return interaction.reply({ embeds: [embed], ephemeral: true });
    }

    if (confirmation.confirmedBy.has(userId)) {
        return interaction.reply({
            content: await t(interaction, 'fun_marry_divorce_already_confirmed'),
            ephemeral: true,
        });
    }

    confirmation.confirmedBy.add(userId);

    if (confirmation.confirmedBy.has(marriage.user1Id) && confirmation.confirmedBy.has(marriage.user2Id)) {
        await marriage.update({ status: 'divorced' });
        divorceConfirmations.delete(key);

        let userA, userB;
        try {
            userA = await interaction.client.users.fetch(marriage.user1Id);
        } catch {}
        try {
            userB = await interaction.client.users.fetch(marriage.user2Id);
        } catch {}

        const embed = new EmbedBuilder()
            .setColor('Red')
            .setTitle(await t(interaction, 'fun_marry_divorced_title'))
            .setDescription(await t(interaction, 'fun_marry_divorced_description'))
            .setFooter(await embedFooter(interaction));

        for (let user of [userA, userB]) {
            if (user) {
                user.send({ embeds: [embed] }).catch(() => {});
            }
        }

        return interaction.reply({ embeds: [embed] });
    } else {
        return interaction.reply({
            content: await t(interaction, 'fun_marry_divorce_confirmed_on_your_side'),
            ephemeral: true,
        });
    }
}

async function kiss(interaction) {
    const userId = interaction.user.id;
    const now = new Date();

    const marriage = await Marriage.getCache({
        where: {
            [Op.or]: [
                { user1Id: userId, status: 'married' },
                { user2Id: userId, status: 'married' },
            ],
        },
    });

    if (!marriage) {
        const embed = new EmbedBuilder()
            .setColor('Red')
            .setDescription(await t(interaction, 'fun_marry_not_married'))
            .setFooter(await embedFooter(interaction));
        return interaction.reply({
            embeds: [embed],
        });
    }

    if (marriage.lastKiss && now - marriage.lastKiss < KISS_COOLDOWN) {
        const remaining = Math.ceil((KISS_COOLDOWN - (now - marriage.lastKiss)) / 60000);
        return interaction.reply({
            content: await t(interaction, 'fun_marry_kiss_cooldown', { minutes: remaining }),
            ephemeral: true,
        });
    }

    await marriage.update({
        lastKiss: now,
        loveScore: marriage.loveScore + 1,
    });

    const partnerId = marriage.user1Id === userId ? marriage.user2Id : marriage.user1Id;
    const partner = await interaction.client.users.fetch(partnerId).catch(() => null);

    const kissMessages = [
        await t(interaction, 'fun_marry_kiss_1', { user: interaction.user.toString(), partner: partner?.toString() || 'Unknown' }),
        await t(interaction, 'fun_marry_kiss_2', { user: interaction.user.toString(), partner: partner?.toString() || 'Unknown' }),
        await t(interaction, 'fun_marry_kiss_3', { user: interaction.user.toString(), partner: partner?.toString() || 'Unknown' }),
    ];

    const randomMessage = kissMessages[Math.floor(Math.random() * kissMessages.length)];

    const embed = new EmbedBuilder()
        .setColor(kythia.bot.color)
        .setDescription(randomMessage)
        .setFooter(await embedFooter(interaction));

    await interaction.reply({ embeds: [embed] });
}

async function viewProfile(interaction) {
    const userId = interaction.user.id;

    const marriage = await Marriage.getCache({
        where: {
            [Op.or]: [
                { user1Id: userId, status: 'married' },
                { user2Id: userId, status: 'married' },
            ],
        },
    });

    if (!marriage) {
        const embed = new EmbedBuilder()
            .setColor('Red')
            .setDescription(await t(interaction, 'fun_marry_not_married'))
            .setFooter(await embedFooter(interaction));
        return interaction.reply({
            embeds: [embed],
        });
    }

    const partnerId = marriage.user1Id === userId ? marriage.user2Id : marriage.user1Id;
    const self = interaction.user;
    const partner = await interaction.client.users.fetch(partnerId).catch(() => null);
    const marriedFor = Math.floor((new Date() - marriage.marriedAt) / (1000 * 60 * 60 * 24));
    const marriedAtStr = marriage.marriedAt.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });

    const selfBlock = `-# ${(await t(interaction, 'fun_marry_profile_you_label', {}, null)) || 'YOU'}\n## ${self.username}\n`;
    const partnerBlock = `-# ${(await t(interaction, 'fun_marry_profile_partner_label', {}, null)) || 'YOUR PARTNER'}\n## ${partner?.username || 'Unknown'}\n`;

    const defaultAvatar = 'https://cdn.discordapp.com/embed/avatars/0.png';
    const selfAvatar = self.displayAvatarURL ? self.displayAvatarURL({ extension: 'png', size: 256 }) : defaultAvatar;
    const partnerAvatar = partner?.displayAvatarURL ? partner.displayAvatarURL({ extension: 'png', size: 256 }) : defaultAvatar;

    const statsSection =
        `${(await t(interaction, 'fun_marry_profile_married_since', {}, null)) || 'Married Since'}\n${marriedAtStr}\n` +
        `${(await t(interaction, 'fun_marry_profile_days_married', {}, null)) || 'Days Together'}\n${marriedFor} days\n` +
        `${(await t(interaction, 'fun_marry_profile_love_score', {}, null)) || 'Love Score'}\n${marriage.loveScore} ❤️`;

    const footerText = `${await t(interaction, 'common_container_footer', { username: interaction.client.user.username })}`;

    const container = new ContainerBuilder()
        .setAccentColor(convertColor(kythia.bot.color, { from: 'hex', to: 'decimal' }))
        .addTextDisplayComponents(
            new TextDisplayBuilder().setContent((await t(interaction, 'fun_marry_profile_title')) || '💘 MARRIAGE PROFILE')
        )
        .addSeparatorComponents(new SeparatorBuilder().setDivider(true))
        .addSectionComponents(
            new SectionBuilder()
                .addTextDisplayComponents(new TextDisplayBuilder().setContent(selfBlock))
                .setThumbnailAccessory(new ThumbnailBuilder().setURL(selfAvatar).setDescription(self.username))
        )
        .addSeparatorComponents(new SeparatorBuilder().setDivider(true))
        .addSectionComponents(
            new SectionBuilder()
                .addTextDisplayComponents(new TextDisplayBuilder().setContent(partnerBlock))
                .setThumbnailAccessory(new ThumbnailBuilder().setURL(partnerAvatar).setDescription(partner?.username || 'Unknown'))
        )
        .addSeparatorComponents(new SeparatorBuilder().setDivider(true))
        .addTextDisplayComponents(new TextDisplayBuilder().setContent(statsSection))
        .addSeparatorComponents(new SeparatorBuilder().setDivider(true))
        .addTextDisplayComponents(new TextDisplayBuilder().setContent(footerText));

    await interaction.reply({
        flags: MessageFlags.IsPersistent | MessageFlags.IsComponentsV2,
        components: [container],
    });
}
