/**
 * @namespace: addons/economy/commands/account/_group.js
 * @type: Subcommand Group Definition
 * @copyright © 2025 kenndeclouv
 * @assistant chaa & graa
 * @version 0.11.0-beta
 */

module.exports = {
	subcommand: true,
	slashCommand: (group) =>
		group.setName('account').setDescription('Manage your kythia bank account.'),
};
