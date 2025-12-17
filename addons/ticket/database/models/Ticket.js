/**
 * @namespace: addons/ticket/database/models/Ticket.js
 * @type: Database Model
 * @copyright © 2025 kenndeclouv
 * @assistant chaa & graa
 * @version 0.11.0-beta
 */

const { KythiaModel } = require('kythia-core');

class Ticket extends KythiaModel {
	static guarded = [];

	static get structure() {
		return {
			options: { timestamps: true },
		};
	}
}

module.exports = Ticket;
