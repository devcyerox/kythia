/**
 * @namespace: addons/core/database/models/UserAFK.js
 * @type: Database Model
 * @copyright © 2025 kenndeclouv
 * @assistant chaa & graa
 * @version 0.10.0-beta
 */

const { KythiaModel } = require('kythia-core');

class UserAFK extends KythiaModel {
	static cacheKeys = [['userId', 'guildId']];

	static table = 'user_afks';

	static guarded = [];
}

module.exports = UserAFK;
