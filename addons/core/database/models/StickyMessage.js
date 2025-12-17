/**
 * @namespace: addons/core/database/models/StickyMessage.js
 * @type: Database Model
 * @copyright © 2025 kenndeclouv
 * @assistant chaa & graa
 * @version 0.11.0-beta
 */

const { KythiaModel } = require('kythia-core');

class StickyMessage extends KythiaModel {
	static cacheKeys = [['channelId']];
	static guarded = [];
}

module.exports = StickyMessage;
