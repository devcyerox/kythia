/**
 * @namespace: addons/checklist/database/models/Checklist.js
 * @type: Database Model
 * @copyright © 2025 kenndeclouv
 * @assistant chaa & graa
 * @version 0.10.1-beta
 */
const { KythiaModel } = require('kythia-core');

class Checklist extends KythiaModel {
	static cacheKeys = [['guildId', 'userId']];
	static guarded = [];
}

module.exports = Checklist;
