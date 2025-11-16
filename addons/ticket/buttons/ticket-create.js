/**
 * @namespace: addons/ticket/buttons/ticket-create.js
 * @type: Module
 * @copyright © 2025 kenndeclouv
 * @assistant chaa & graa
 * @version 0.9.12-beta
 */
const { createTicketChannel } = require('../helpers');
const { MessageFlags } = require('discord.js');

module.exports = {
    execute: async (interaction, container) => {
        const { models, helpers, t } = container;
        const { TicketConfig } = models;
        const { simpleContainer } = helpers.discord;

        const configId = interaction.customId.split(':')[1];
        if (!configId) {
            const desc = await t(interaction, 'ticket.errors.missing_config_id');
            return interaction.reply({
                components: await simpleContainer(interaction, desc, { color: 'Red' }),
                flags: MessageFlags.IsComponentsV2 | MessageFlags.Ephemeral,
            });
        }

        const ticketConfig = await TicketConfig.getCache({ id: configId });
        if (!ticketConfig) {
            const desc = await t(interaction, 'ticket.errors.invalid_config');
            return interaction.reply({
                components: await simpleContainer(interaction, desc, { color: 'Red' }),
                flags: MessageFlags.IsComponentsV2 | MessageFlags.Ephemeral,
            });
        }

        await createTicketChannel(interaction, ticketConfig, container);
    },
};
