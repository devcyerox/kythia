/**
 * @namespace: addons/ticket/buttons/ticket-confirm-close.js
 * @type: Module
 * @copyright © 2025 kenndeclouv
 * @assistant chaa & graa
 * @version 0.11.0-beta
 */
const { closeTicket } = require('../helpers');

module.exports = {
	execute: async (interaction, container) => {
		await closeTicket(interaction, container);
	},
};
