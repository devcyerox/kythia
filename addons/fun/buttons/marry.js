/**
 * @namespace: addons/fun/buttons/marry.js
 * @type: Module
 * @copyright © 2025 kenndeclouv
 * @assistant chaa & graa
 * @version 0.9.9-beta-rc.3
 */

const { t } = require('@utils/translator');
const { embedFooter } = require('@utils/discord');
const Marriage = require('../database/models/Marriage');
const { ContainerBuilder, TextDisplayBuilder, SeparatorBuilder } = require('discord.js');
const convertColor = require('@utils/color');

module.exports = {
    execute: async (interaction) => {
        const [prefix, actionType, marriageId] = interaction.customId.split('_');
        if (prefix !== 'marry' || !actionType || !marriageId) return;

        const marriage = await Marriage.getCache({ id: marriageId });

        if (actionType === 'accept') {
            if (!marriage || marriage.status !== 'pending') {
                const container = new ContainerBuilder()
                    .setAccentColor(convertColor(kythia.bot.color, { from: 'hex', to: 'decimal' }))
                    .addTextDisplayComponents(new TextDisplayBuilder().setContent(await t(interaction, 'fun_marry_proposal_expired')))
                    .addSeparatorComponents(new SeparatorBuilder().setDivider(true))
                    .addTextDisplayComponents(
                        new TextDisplayBuilder().setContent(
                            await t(interaction, 'common_container_footer', { username: interaction.client.user.username })
                        )
                    );
                return interaction.update({
                    components: [container],
                });
            }

            if (interaction.user.id !== marriage.user2Id) {
                return interaction.reply({
                    content: await t(interaction, 'fun_marry_not_your_proposal'),
                    ephemeral: true,
                });
            }

            await marriage.update({
                status: 'married',
                marriedAt: new Date(),
                loveScore: 0,
            });

            let user1Display, user2Display;

            try {
                const user1 = await interaction.client.users.fetch(marriage.user1Id);
                user1Display = user1 ? user1.toString() : 'Unknown';
            } catch {
                user1Display = 'Unknown';
            }
            user2Display = interaction.user.toString();

            const congratsTitle = `## ${await t(interaction, 'fun_marry_congrats_title')}`;
            const congratsDesc = await t(interaction, 'fun_marry_congrats_description', {
                user1: user1Display,
                user2: user2Display,
            });
            const footer = await t(interaction, 'common_container_footer', { username: interaction.client.user.username });

            const container = new ContainerBuilder()
                .setAccentColor(convertColor(kythia.bot.color, { from: 'hex', to: 'decimal' }))
                .addTextDisplayComponents(new TextDisplayBuilder().setContent(congratsTitle))
                .addSeparatorComponents(new SeparatorBuilder().setDivider(true))
                .addTextDisplayComponents(new TextDisplayBuilder().setContent(congratsDesc))
                .addSeparatorComponents(new SeparatorBuilder().setDivider(true))
                .addTextDisplayComponents(new TextDisplayBuilder().setContent(footer));

            await interaction.update({
                components: [container],
            });
        } else if (actionType === 'reject') {
            if (!marriage || marriage.status !== 'pending') {
                const container = new ContainerBuilder()
                    .setAccentColor(convertColor(kythia.bot.color, { from: 'hex', to: 'decimal' }))
                    .addTextDisplayComponents(new TextDisplayBuilder().setContent(await t(interaction, 'fun_marry_proposal_expired')))
                    .addSeparatorComponents(new SeparatorBuilder().setDivider(true))
                    .addTextDisplayComponents(
                        new TextDisplayBuilder().setContent(
                            await t(interaction, 'common_container_footer', { username: interaction.client.user.username })
                        )
                    );
                return interaction.update({
                    components: [container],
                });
            }

            if (interaction.user.id !== marriage.user2Id) {
                return interaction.reply({
                    content: await t(interaction, 'fun_marry_not_your_proposal'),
                    ephemeral: true,
                });
            }

            await marriage.update({ status: 'rejected' });

            const rejectedText = await t(interaction, 'fun_marry_proposal_rejected', {
                user1: `<@${marriage.user1Id}>`,
                user2: `<@${marriage.user2Id}>`,
            });
            const footer = await t(interaction, 'common_container_footer', { username: interaction.client.user.username });

            const container = new ContainerBuilder()
                .setAccentColor(convertColor('Red', { from: 'discord', to: 'decimal' }))
                .addTextDisplayComponents(new TextDisplayBuilder().setContent(rejectedText))
                .addSeparatorComponents(new SeparatorBuilder().setDivider(true))
                .addTextDisplayComponents(new TextDisplayBuilder().setContent(footer));

            await interaction.update({
                components: [container],
            });
        }
    },
};
