/**
 * @namespace: addons/ticket/commands/type/_group.js
 * @type: Subcommand Group Definition
 * @copyright © 2025 kenndeclouv
 * @assistant chaa & graa
 * @version 0.10.1-beta
 */
module.exports = {
	subcommand: true,
	slashCommand: (subcommandGroup) =>
		subcommandGroup
			.setName('type')
			.setDescription('Manage ticket types (e.g., "Report", "Ask")'),
};
