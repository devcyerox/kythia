/**
 * @namespace: addons/pet/commands/_command.js
 * @type: Command Group Definition
 * @copyright © 2025 kenndeclouv
 * @assistant chaa & graa
 * @version 0.11.0-beta
 */
const { SlashCommandBuilder, InteractionContextType } = require('discord.js');

module.exports = {
	guildOnly: true,
	slashCommand: new SlashCommandBuilder()
		.setName('pet')
		.setDescription('🐾 All commands related to the pet system.')
		.setContexts(InteractionContextType.Guild),
};
