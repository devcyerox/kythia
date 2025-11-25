/**
 * @namespace: addons/music/database/models/Favorite.js
 * @type: Database Model
 * @copyright © 2025 kenndeclouv
 * @assistant chaa & graa
 * @version 0.10.0-beta
 */

const { KythiaModel } = require('kythia-core');

class Favorite extends KythiaModel {
	static cacheKeys = [['userId']];
	static guarded = [];

	static get structure() {
		return {
			options: { timestamps: true },
		};
	}
}

module.exports = Favorite;
