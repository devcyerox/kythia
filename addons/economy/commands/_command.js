/**
 * @namespace: addons/economy/commands/_command.js
 * @type: Command Group Definition
 * @copyright © 2025 kenndeclouv
 * @assistant chaa & graa
 * @version 0.10.1-beta
 */
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	subcommand: true,
	slashCommand: new SlashCommandBuilder()
		.setName('eco')
		.setDescription('💰 Get your money and become rich'),
};
