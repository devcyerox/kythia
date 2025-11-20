/**
 * @namespace: addons/core/database/models/KythiaVoter.js
 * @type: Database Model
 * @copyright © 2025 kenndeclouv
 * @assistant chaa & graa
 * @version 0.9.12-beta
 */

const { DataTypes } = require("sequelize");

const { KythiaModel } = require("kythia-core");

class KythiaVoter extends KythiaModel {
	static init(sequelize) {
		KythiaModel.init(
			{
				userId: { type: DataTypes.STRING, allowNull: false, primaryKey: true },
				votedAt: { type: DataTypes.DATE, allowNull: false },
			},
			{
				sequelize,
				modelName: "KythiaVoter",
				tableName: "kythia_voters",
				timestamps: false,
			},
		);

		return KythiaVoter;
	}
}

// KythiaVoter.init(sequelize);

module.exports = KythiaVoter;
