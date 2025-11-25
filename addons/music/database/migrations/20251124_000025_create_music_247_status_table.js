/**
 * @namespace: addons/music/database/migrations/20251124_000025_create_music_247_status_table.js
 * @type: Database Migration
 * @copyright © 2025 kenndeclouv
 * @assistant chaa & graa
 * @version 0.10.0-beta
 */

module.exports = {
	async up(queryInterface, DataTypes) {
		await queryInterface.createTable('music_247_status', {
			guildId: {
				type: DataTypes.STRING,
				primaryKey: true,
				allowNull: false,
				unique: true,
			},
			textChannelId: { type: DataTypes.STRING, allowNull: false },
			voiceChannelId: { type: DataTypes.STRING, allowNull: false },
			createdAt: { type: DataTypes.DATE, allowNull: false },
			updatedAt: { type: DataTypes.DATE, allowNull: false },
		});
	},
	async down(queryInterface) {
		await queryInterface.dropTable('music_247_status');
	},
};
