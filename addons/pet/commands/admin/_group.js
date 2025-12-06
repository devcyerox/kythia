/**
 * @namespace: addons/pet/commands/admin/_group.js
 * @type: Subcommand Group Definition
 * @copyright © 2025 kenndeclouv
 * @assistant chaa & graa
 * @version 0.10.1-beta
 */

module.exports = {
	subcommand: true,
	slashCommand: (group) =>
		group
			.setName('admin')
			.setDescription('Administrative pet management commands.'),
};
