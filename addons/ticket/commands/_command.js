/**
 * @namespace: addons/ticket/commands/_command.js
 * @type: Command Group Definition
 * @copyright © 2025 kenndeclouv
 * @assistant chaa & graa
 * @version 0.10.1-beta
 */
const {
	SlashCommandBuilder,
	InteractionContextType,
	PermissionFlagsBits,
} = require('discord.js');

module.exports = {
	slashCommand: new SlashCommandBuilder()
		.setName('ticket')
		.setDescription('🎟️ All commands related to kythia ticket system.')
		.setContexts(InteractionContextType.Guild)
		.setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
	permissions: [PermissionFlagsBits.ManageGuild],
};
