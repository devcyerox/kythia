/**
 * @namespace: addons/core/database/models/KythiaSetting.js
 * @type: Database Model
 * @copyright © 2025 kenndeclouv
 * @assistant chaa & graa
 * @version 0.11.0-beta
 */

const { KythiaModel } = require('kythia-core');

class KythiaSetting extends KythiaModel {
	static cacheKeys = [['guildId']];

	static guarded = [];
}

module.exports = KythiaSetting;
