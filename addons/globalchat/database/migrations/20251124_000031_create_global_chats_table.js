/**
 * @namespace: addons/globalchat/database/migrations/20251124_000031_create_global_chats_table.js
 * @type: Database Migration
 * @copyright © 2025 kenndeclouv
 * @assistant chaa & graa
 * @version 0.11.0-beta
 */

module.exports = {
	async up(queryInterface, DataTypes) {
		await queryInterface.createTable('global_chats', {
			guildId: {
				type: DataTypes.STRING,
				allowNull: false,
				primaryKey: true,
			},
			globalChannelId: { type: DataTypes.STRING, allowNull: true },
			webhookId: { type: DataTypes.STRING, allowNull: true },
			webhookToken: { type: DataTypes.STRING, allowNull: true },
			createdAt: { type: DataTypes.DATE, allowNull: false },
			updatedAt: { type: DataTypes.DATE, allowNull: false },
		});
	},
	async down(queryInterface) {
		await queryInterface.dropTable('global_chats');
	},
};
