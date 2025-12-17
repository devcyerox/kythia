/**
 * @namespace: addons/pro/commands/claim/_group.js
 * @type: Subcommand Group Definition
 * @copyright © 2025 kenndeclouv
 * @assistant chaa & graa
 * @version 0.11.0-beta
 */
module.exports = {
	subcommand: true,
	slashCommand: (subcommandGroup) =>
		subcommandGroup.setName('claim').setDescription('🌐 Klaim Your Rewards!'),
};
