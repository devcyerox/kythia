/**
 * @namespace: addons/invite/database/models/Invite.js
 * @type: Database Model
 * @copyright © 2025 kenndeclouv
 * @assistant chaa & graa
 * @version 0.11.0-beta
 */

const { KythiaModel } = require('kythia-core');

class Invite extends KythiaModel {
	static cacheKeys = [['userId', 'guildId']];
	static guarded = [];

	static get structure() {
		return {
			options: { timestamps: false },
		};
	}
}

module.exports = Invite;
