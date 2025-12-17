/**
 * @namespace: addons/economy/commands/market/_group.js
 * @type: Subcommand Group Definition
 * @copyright © 2025 kenndeclouv
 * @assistant chaa & graa
 * @version 0.11.0-beta
 */

module.exports = {
	subcommand: true,
	slashCommand: (group) =>
		group
			.setName('market')
			.setDescription('📈 Interact with the Kythia Stock Exchange.'),
};
