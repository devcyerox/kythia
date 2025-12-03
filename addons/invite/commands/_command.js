/**
 * @namespace: addons/invite/commands/_command.js
 * @type: Command Group Definition
 * @copyright © 2025 kenndeclouv
 * @assistant chaa & graa
 * @version 0.10.0-beta
 */
const {
	SlashCommandBuilder,
	InteractionContextType,
} = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('invites')
		.setDescription('🔗 Manage invites and rewards')
		.setContexts(InteractionContextType.Guild),
};
