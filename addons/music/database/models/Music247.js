/**
 * @namespace: addons/music/database/models/Music247.js
 * @type: Database Model
 * @copyright © 2025 kenndeclouv
 * @assistant chaa & graa
 * @version 0.11.0-beta
 */

const { KythiaModel } = require('kythia-core');

class Music247 extends KythiaModel {
	static cacheKeys = [['guildId']];
	static guarded = [];
	static table = 'music_247_status';

	static get structure() {
		return {
			options: { timestamps: true },
		};
	}
}

module.exports = Music247;
