/**
 * @namespace: addons/economy/database/models/MarketTransaction.js
 * @type: Database Model
 * @copyright © 2025 kenndeclouv
 * @assistant chaa & graa
 * @version 0.10.0-beta
 */
const { KythiaModel } = require('kythia-core');

class MarketTransaction extends KythiaModel {
	static guarded = [];

	static get structure() {
		return {
			attributes: {},
			options: { timestamps: true },
		};
	}
}

module.exports = MarketTransaction;
