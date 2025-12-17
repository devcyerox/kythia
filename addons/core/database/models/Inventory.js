/**
 * @namespace: addons/core/database/models/Inventory.js
 * @type: Database Model
 * @copyright © 2025 kenndeclouv
 * @assistant chaa & graa
 * @version 0.11.0-beta
 */

const { KythiaModel } = require('kythia-core');

class Inventory extends KythiaModel {
	static cacheKeys = [['userId']];

	static guarded = [];
}

module.exports = Inventory;
