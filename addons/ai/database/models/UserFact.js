/**
 * @namespace: addons/ai/database/models/UserFact.js
 * @type: Database Model
 * @copyright © 2025 kenndeclouv
 * @assistant chaa & graa
 * @version 0.10.0-beta
 */
const { KythiaModel } = require('kythia-core');

class UserFact extends KythiaModel {
	static cacheKeys = [['userId']];
	static guarded = [];

	static get structure() {
		return {
			attributes: {},
			options: { timestamps: true },
		};
	}
}

module.exports = UserFact;
