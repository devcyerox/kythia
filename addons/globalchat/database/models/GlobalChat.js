/**
 * @namespace: addons/globalchat/database/models/GlobalChat.js
 * @type: Database Model
 * @copyright © 2025 kenndeclouv
 * @assistant chaa & graa
 * @version 0.11.0-beta
 */

const { KythiaModel } = require('kythia-core');

class GlobalChat extends KythiaModel {
	static guarded = [];

	static get structure() {
		return {
			options: { timestamps: true },
		};
	}
}

module.exports = GlobalChat;
