/**
 * @namespace: addons/image/commands/_command.js
 * @type: Command Group Definition
 * @copyright © 2025 kenndeclouv
 * @assistant chaa & graa
 * @version 0.10.1-beta
 */
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	guildOnly: false,
	slashCommand: new SlashCommandBuilder()
		.setName('image')
		.setDescription('Manage images in the storage'),
};
