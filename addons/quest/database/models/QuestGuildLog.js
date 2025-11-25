/**
 * @namespace: addons/quest/database/models/QuestGuildLog.js
 * @type: Database Model
 * @copyright © 2025 kenndeclouv
 * @assistant chaa & graa
 * @version 0.10.0-beta
 */

const { KythiaModel } = require('kythia-core');

class QuestGuildLog extends KythiaModel {
	static guarded = ['id'];

	static get structure() {
		return {
			options: { timestamps: false },
		};
	}
}

module.exports = QuestGuildLog;
