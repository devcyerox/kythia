/**
 * @namespace: addons/economy/database/models/MarketOrder.js
 * @type: Database Model
 * @copyright © 2025 kenndeclouv
 * @assistant chaa & graa
 * @version 0.10.1-beta
 */
const { KythiaModel } = require('kythia-core');

class MarketOrder extends KythiaModel {
	static guarded = [];

	static get structure() {
		return {
			options: { timestamps: true },
		};
	}
}

module.exports = MarketOrder;
