/**
 * @namespace: addons/ticket/buttons/ticket-close.js
 * @type: Module
 * @copyright © 2025 kenndeclouv
 * @assistant chaa & graa
 * @version 0.9.12-beta
 */

const { closeTicket } = require('../helpers');
const { MessageFlags } = require('discord.js');

module.exports = {
    execute: async (interaction, container) => {
        const { models, t, helpers } = container;
        const { Ticket } = models;
        const { simpleContainer } = helpers.discord;

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

        return closeTicket(interaction, container);
    },
};
