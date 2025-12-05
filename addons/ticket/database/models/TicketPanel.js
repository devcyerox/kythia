/**
 * @namespace: addons/ticket/database/models/TicketPanel.js
 * @type: Database Model
 * @copyright © 2025 kenndeclouv
 * @assistant chaa & graa
 * @version 0.10.1-beta
 */

const { KythiaModel } = require('kythia-core');

class TicketPanel extends KythiaModel {
	static guarded = [];

	static get structure() {
		return {
			options: { timestamps: true },
		};
	}
}

module.exports = TicketPanel;
