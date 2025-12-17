/**
 * @namespace: addons/core/commands/moderation/_command.js
 * @type: Command Group Definition
 * @copyright © 2025 kenndeclouv
 * @assistant chaa & graa
 * @version 0.11.0-beta
 */
const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
	slashCommand: new SlashCommandBuilder()
		.setName('mod')
		.setDescription('Moderation action')
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
};
