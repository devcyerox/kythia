/**
 * @namespace: addons/core/database/models/KythiaUser.js
 * @type: Database Model
 * @copyright © 2025 kenndeclouv
 * @assistant chaa & graa
 * @version 0.10.0-beta
 */

const { KythiaModel } = require('kythia-core');

class KythiaUser extends KythiaModel {
	// static cacheKeys = [["userId"]];
	static customInvalidationTags = ['KythiaUser:leaderboard'];

	static guarded = [];

	static associate(models) {
		if (models.UserPet) {
			this.hasMany(models.UserPet, {
				foreignKey: 'userId',
				as: 'pets',
			});
		}
	}
}

module.exports = KythiaUser;
