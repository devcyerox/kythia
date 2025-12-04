/**
 * @namespace: addons/streak/database/models/Streak.js
 * @type: Database Model
 * @copyright © 2025 kenndeclouv
 * @assistant chaa & graa
 * @version 0.10.0-beta
 */

const { KythiaModel } = require('kythia-core');

class Streak extends KythiaModel {
	static customInvalidationTags = ['Streak:leaderboard'];
	static guarded = [];

	static get structure() {
		return {
			options: { timestamps: true },
		};
	}
}

module.exports = Streak;
