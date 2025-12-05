/**
 * @namespace: addons/giveaway/database/migrations/20251124_000021_create_giveaways_table.js
 * @type: Database Migration
 * @copyright © 2025 kenndeclouv
 * @assistant chaa & graa
 * @version 0.10.1-beta
 */

module.exports = {
	async up(queryInterface, DataTypes) {
		await queryInterface.createTable('giveaways', {
			id: {
				type: DataTypes.INTEGER,
				autoIncrement: true,
				primaryKey: true,
			},
			guildId: { type: DataTypes.STRING, allowNull: false },
			channelId: { type: DataTypes.STRING, allowNull: false },
			messageId: { type: DataTypes.STRING, allowNull: false },
			hostId: { type: DataTypes.STRING, allowNull: false },
			duration: { type: DataTypes.INTEGER, allowNull: false },
			winners: { type: DataTypes.INTEGER, allowNull: false },
			prize: { type: DataTypes.STRING, allowNull: false },
			participants: { type: DataTypes.JSON, defaultValue: [] },
			ended: { type: DataTypes.BOOLEAN, defaultValue: false },
			roleId: { type: DataTypes.STRING, allowNull: true },
			color: { type: DataTypes.STRING, allowNull: true },
			endTime: { type: DataTypes.DATE, allowNull: true },
			description: { type: DataTypes.TEXT, allowNull: true },
		});

		// Indexing biar query cepet (Opsional, tapi recommended buat guildId/messageId)
		await queryInterface.addIndex('giveaways', ['guildId']);
		await queryInterface.addIndex('giveaways', ['messageId']);
	},

	async down(queryInterface) {
		await queryInterface.dropTable('giveaways');
	},
};
