/**
 * @namespace: addons/tempvoice/database/models/TempVoiceConfig.js
 * @type: Database Model
 * @copyright © 2025 kenndeclouv
 * @assistant chaa & graa
 * @version 0.10.1-beta
 */

const { KythiaModel } = require('kythia-core');

class TempVoiceConfig extends KythiaModel {
	static guarded = [];

	static get structure() {
		return {
			options: { timestamps: true },
		};
	}
}

module.exports = TempVoiceConfig;
