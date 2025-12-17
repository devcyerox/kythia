/**
 * @namespace: addons/core/database/models/User.js
 * @type: Database Model
 * @copyright © 2025 kenndeclouv
 * @assistant chaa & graa
 * @version 0.11.0-beta
 */

const { KythiaModel } = require('kythia-core');

class User extends KythiaModel {
	static cacheKeys = [['userId', 'guildId']];
	static customInvalidationTags = ['User:leaderboard'];

	static guarded = [];
}

module.exports = User;
