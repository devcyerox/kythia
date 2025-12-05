/**
 * @namespace: addons/dashboard/database/models/Session.js
 * @type: Database Model
 * @copyright © 2025 kenndeclouv
 * @assistant chaa & graa
 * @version 0.10.1-beta
 */
const { KythiaModel } = require('kythia-core');

class Session extends KythiaModel {
	static guarded = [];

	static get structure() {
		return {
			attributes: {},
			options: { timestamps: true },
		};
	}
}

module.exports = Session;
