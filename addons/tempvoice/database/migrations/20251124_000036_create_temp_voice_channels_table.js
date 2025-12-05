/**
 * @namespace: addons/tempvoice/database/migrations/20251124_000036_create_temp_voice_channels_table.js
 * @type: Database Migration
 * @copyright © 2025 kenndeclouv
 * @assistant chaa & graa
 * @version 0.10.1-beta
 */

module.exports = {
	async up(queryInterface, DataTypes) {
		await queryInterface.createTable('temp_voice_channels', {
			channelId: {
				type: DataTypes.STRING,
				primaryKey: true,
				allowNull: false,
			},
			guildId: { type: DataTypes.STRING, allowNull: false },
			ownerId: { type: DataTypes.STRING, allowNull: false },
			waitingRoomChannelId: { type: DataTypes.STRING, allowNull: true },
			pendingJoinRequests: {
				type: DataTypes.JSON,
				allowNull: true,
				defaultValue: {},
			},
			createdAt: { type: DataTypes.DATE, allowNull: false },
			updatedAt: { type: DataTypes.DATE, allowNull: false },
		});

		await queryInterface.addIndex('temp_voice_channels', ['guildId']);
		await queryInterface.addIndex('temp_voice_channels', ['ownerId']);
	},
	async down(queryInterface) {
		await queryInterface.dropTable('temp_voice_channels');
	},
};
