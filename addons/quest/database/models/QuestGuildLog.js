/**
 * @namespace: addons/quest/database/models/QuestGuildLog.js
 * @type: Database Model
 * @copyright © 2025 kenndeclouv
 * @assistant chaa & graa
 * @version 0.11.0-beta
 */

const { KythiaModel } = require('kythia-core');

class QuestGuildLog extends KythiaModel {
	static guarded = [];

	static get structure() {
		return {
			options: { timestamps: false },
		};
	}
}

module.exports = QuestGuildLog;
