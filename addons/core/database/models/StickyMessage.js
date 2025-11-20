/**
 * @namespace: addons/core/database/models/StickyMessage.js
 * @type: Database Model
 * @copyright © 2025 kenndeclouv
 * @assistant chaa & graa
 * @version 0.9.12-beta
 */

const { DataTypes } = require("sequelize");

const { KythiaModel } = require("kythia-core");

class StickyMessage extends KythiaModel {
	static CACHE_KEYS = [["channelId"]];
	static init(sequelize) {
		KythiaModel.init(
			{
				channelId: { type: DataTypes.STRING, allowNull: false },
				message: { type: DataTypes.STRING, allowNull: false },
				messageId: { type: DataTypes.STRING, allowNull: true },
			},
			{
				sequelize,
				modelName: "StickyMessage",
				tableName: "sticky_messages",
				timestamps: false,
			},
		);

		return StickyMessage;
	}
}

// StickyMessage.init(sequelize);

module.exports = StickyMessage;
