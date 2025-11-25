/**
 * @namespace: addons/invite/database/models/InviteHistory.js
 * @type: Database Model
 * @copyright © 2025 kenndeclouv
 * @assistant chaa & graa
 * @version 0.10.0-beta
 */

const { KythiaModel } = require('kythia-core');

class InviteHistory extends KythiaModel {
	static cacheKeys = [['guildId']];
	static guarded = [];
	static table = 'invite_histories';

	static get structure() {
		return {
			options: { timestamps: true },
		};
	}
}

module.exports = InviteHistory;
