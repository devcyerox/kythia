/**
 * @namespace: addons/ticket/buttons/ticket-cancel-close.js
 * @type: Module
 * @copyright © 2025 kenndeclouv
 * @assistant chaa & graa
 * @version 0.10.1-beta
 */
module.exports = {
	execute: async (interaction) => {
		await interaction.message.delete().catch(() => {});
	},
};
