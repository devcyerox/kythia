/**
 * @namespace: addons/ticket/select_menus/ticket-select.js
 * @type: Module
 * @copyright © 2025 kenndeclouv
 * @assistant chaa & graa
 * @version 0.9.12-beta
 */
const { createTicketChannel } = require('../helpers');

module.exports = {
    execute: async (interaction, container) => {
        const { models } = container;
        const { TicketConfig } = models;

        // Ambil ID Config dari value select menu
        const configId = interaction.values[0];
        if (!configId) {
            return interaction.reply({ content: '❌ Pilihan tiket tidak valid.', ephemeral: true });
        }

        const ticketConfig = await TicketConfig.getCache({ id: configId });
        if (!ticketConfig) {
            return interaction.reply({ content: '❌ Konfigurasi tiket ini sudah tidak valid.', ephemeral: true });
        }
        
        // Panggil helper universal
        await createTicketChannel(interaction, ticketConfig, container);
    },
};