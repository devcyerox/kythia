/**
 * @namespace: addons/quest/database/models/QuestConfig.js
 * @type: Database Model
 * @copyright © 2025 kenndeclouv
 * @assistant chaa & graa
 * @version 0.10.1-beta
 */

const { KythiaModel } = require('kythia-core');

class QuestConfig extends KythiaModel {
	static guarded = [];

	static get structure() {
		return {
			options: { timestamps: true },
		};
	}
}

module.exports = QuestConfig;
