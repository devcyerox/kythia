/**
 * @namespace: addons/core/database/models/ServerSetting.js
 * @type: Database Model
 * @copyright © 2025 kenndeclouv
 * @assistant chaa & graa
 * @version 0.10.1-beta
 */

// const { DataTypes } = require("sequelize");
// koneksi sequelize
const { KythiaModel } = require('kythia-core');

class ServerSetting extends KythiaModel {
	static cacheKeys = [['guildId']];

	static guarded = [];
}

module.exports = ServerSetting;
