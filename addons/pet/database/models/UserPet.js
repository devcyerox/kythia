/**
 * @namespace: addons/pet/database/models/UserPet.js
 * @type: Database Model
 * @copyright © 2025 kenndeclouv
 * @assistant chaa & graa
 * @version 0.11.0-beta
 */

const { KythiaModel } = require('kythia-core');

class UserPet extends KythiaModel {
	static customInvalidationTags = ['UserPet:leaderboard'];
	static guarded = [];

	static get structure() {
		return {
			options: { timestamps: false },
		};
	}

	static associate(models) {
		this.belongsTo(models.KythiaUser, {
			foreignKey: 'userId',
			as: 'user',
		});

		this.belongsTo(models.Pet, {
			foreignKey: 'petId',
			as: 'pet',
		});
	}
}

module.exports = UserPet;
