/**
 * @namespace: addons/core/commands/premium/premium.js
 * @type: Command
 * @copyright © 2025 kenndeclouv
 * @assistant chaa & graa
 * @version 0.9.10-beta
 */
const { SlashCommandBuilder, EmbedBuilder, InteractionContextType, PermissionFlagsBits } = require('discord.js');
const KythiaUser = require('@coreModels/KythiaUser');
const { Op } = require('sequelize');
const { embedFooter } = require('@coreHelpers/discord');
const { t } = require('@coreHelpers/translator');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('premium')
        .setDescription('💰 Manage premium user status (add, delete, edit, list, info)')
        .addSubcommand((sub) =>
            sub
                .setName('add')
                .setDescription('Add a user to premium')
                .addUserOption((opt) => opt.setName('user').setDescription('User to grant premium').setRequired(true))
                .addIntegerOption((opt) => opt.setName('days').setDescription('Number of premium days (default 30)').setRequired(false))
        )
        .addSubcommand((sub) =>
            sub
                .setName('delete')
                .setDescription("Remove user's premium status")
                .addUserOption((opt) => opt.setName('user').setDescription('User to remove premium from').setRequired(true))
        )
        .addSubcommand((sub) =>
            sub
                .setName('edit')
                .setDescription("Edit user's premium duration")
                .addUserOption((opt) => opt.setName('user').setDescription('User to edit premium for').setRequired(true))
                .addIntegerOption((opt) => opt.setName('days').setDescription('New number of premium days').setRequired(true))
        )
        .addSubcommand((sub) => sub.setName('list').setDescription('View list of premium users'))
        .addSubcommand((sub) =>
            sub
                .setName('info')
                .setDescription('View premium info for a user')
                .addUserOption((opt) => opt.setName('user').setDescription('User to check').setRequired(true))
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    ownerOnly: true,
    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });
        const subcommand = interaction.options.getSubcommand();

        if (subcommand === 'add') {
            const user = interaction.options.getUser('user');
            const days = interaction.options.getInteger('days') ?? 30;
            const expiresAt = new Date(Date.now() + days * 24 * 60 * 60 * 1000);

            let kythiaUser = await KythiaUser.getCache({ userId: user.id });
            if (kythiaUser) {
                kythiaUser.isPremium = true;
                kythiaUser.premiumExpiresAt = expiresAt;
                await kythiaUser.save();
            } else {
                kythiaUser = await KythiaUser.create({
                    userId: user.id,
                    isPremium: true,
                    premiumExpiresAt: expiresAt,
                });
            }

            return interaction.editReply(
                await t(interaction, 'core.premium.premium.add.success', {
                    user: `<@${user.id}>`,
                    days,
                    expires: `<t:${Math.floor(expiresAt.getTime() / 1000)}:R>`,
                })
            );
        }

        if (subcommand === 'delete') {
            const user = interaction.options.getUser('user');
            const kythiaUser = await KythiaUser.getCache({ userId: user.id });
            if (!kythiaUser) {
                return interaction.editReply(await t(interaction, 'core.premium.premium.not.premium'));
            }
            await kythiaUser.destroy();
            return interaction.editReply(
                await t(interaction, 'core.premium.premium.delete.success', {
                    user: `<@${user.id}>`,
                })
            );
        }

        if (subcommand === 'edit') {
            const user = interaction.options.getUser('user');
            const days = interaction.options.getInteger('days');
            const kythiaUser = await KythiaUser.getCache({ userId: user.id });
            if (!kythiaUser) {
                return interaction.editReply(await t(interaction, 'core.premium.premium.not.premium'));
            }
            const expiresAt = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
            kythiaUser.premiumExpiresAt = expiresAt;
            await kythiaUser.save();
            return interaction.editReply(
                await t(interaction, 'core.premium.premium.edit.success', {
                    user: `<@${user.id}>`,
                    days,
                    expires: `<t:${Math.floor(expiresAt.getTime() / 1000)}:R>`,
                })
            );
        }

        if (subcommand === 'list') {
            const now = new Date();
            const list = await KythiaUser.getAllCache({
                where: {
                    isPremium: true,
                    premiumExpiresAt: { [Op.gt]: now },
                },
                order: [['premiumExpiresAt', 'ASC']],
                cacheTags: ['KythiaUser:premium:list'],
            });

            if (!list.length) {
                return interaction.editReply(await t(interaction, 'core.premium.premium.list.empty'));
            }

            const embed = new EmbedBuilder()
                .setColor(kythia.bot.color)
                .setTitle(await t(interaction, 'core.premium.premium.list.title'))
                .setDescription(
                    (
                        await Promise.all(
                            list.map(
                                async (p, i) =>
                                    await t(interaction, 'core.premium.premium.list.item', {
                                        index: i + 1,
                                        user: `<@${p.userId}>`,
                                        expires: `<t:${Math.floor(new Date(p.premiumExpiresAt).getTime() / 1000)}:R>`,
                                    })
                            )
                        )
                    ).join('\n')
                )
                .setFooter(await embedFooter(interaction));

            return interaction.editReply({ embeds: [embed] });
        }

        if (subcommand === 'info') {
            const user = interaction.options.getUser('user');
            const kythiaUser = await KythiaUser.getCache({ userId: user.id });
            if (!kythiaUser || !kythiaUser.isPremium || new Date(kythiaUser.premiumExpiresAt) < new Date()) {
                return interaction.editReply(
                    await t(interaction, 'core.premium.premium.info.not.active', {
                        user: `<@${user.id}>`,
                    })
                );
            }
            const embed = new EmbedBuilder()
                .setColor(kythia.bot.color)
                .setTitle(await t(interaction, 'core.premium.premium.info.title', { tag: user.tag }))
                .addFields(
                    {
                        name: await t(interaction, 'core.premium.premium.info.field.user'),
                        value: `<@${user.id}> (${user.id})`,
                    },
                    {
                        name: await t(interaction, 'core.premium.premium.info.field.status'),
                        value: kythiaUser.isPremium
                            ? await t(interaction, 'core.premium.premium.info.status.active')
                            : await t(interaction, 'core.premium.premium.info.status.inactive'),
                    },
                    {
                        name: await t(interaction, 'core.premium.premium.info.field.expires'),
                        value: `<t:${Math.floor(new Date(kythiaUser.premiumExpiresAt).getTime() / 1000)}:F>`,
                        inline: false,
                    }
                );
            return interaction.editReply({ embeds: [embed] });
        }
    },
};
