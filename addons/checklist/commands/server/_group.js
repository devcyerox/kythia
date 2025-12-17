/**
 * @namespace: addons/checklist/commands/server/_group.js
 * @type: Subcommand Group Definition
 * @copyright © 2025 kenndeclouv
 * @assistant chaa & graa
 * @version 0.11.0-beta
 */

module.exports = {
	subcommand: true,
	slashCommand: (group) =>
		group.setName('server').setDescription('Manage server checklist (public)'),
};
