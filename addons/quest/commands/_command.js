/**
 * @namespace: addons/quest/commands/_command.js
 * @type: Command Group Definition
 * @copyright © 2025 kenndeclouv
 * @assistant chaa & graa
 * @version 0.11.0-beta
 */
const {
	SlashCommandBuilder,
	PermissionFlagsBits,
	InteractionContextType,
} = require('discord.js');

module.exports = {
	slashCommand: new SlashCommandBuilder()
		.setName('quest')
		.setDescription('🎁 Manage the Discord Quest Notifier system.')
		.setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
		.setContexts(InteractionContextType.Guild),
};
