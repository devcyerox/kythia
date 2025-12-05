/**
 * @namespace: addons/core/database/models/KythiaTeam.js
 * @type: Database Model
 * @copyright © 2025 kenndeclouv
 * @assistant chaa & graa
 * @version 0.10.1-beta
 */

// const { DataTypes } = require("sequelize");

const { KythiaModel } = require('kythia-core');

class KythiaTeam extends KythiaModel {
	static guarded = [];
}

module.exports = KythiaTeam;
