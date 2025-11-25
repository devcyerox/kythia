/**
 * @namespace: addons/music/database/migrations/20251124_000022_create_playlists_table.js
 * @type: Database Migration
 * @copyright © 2025 kenndeclouv
 * @assistant chaa & graa
 * @version 0.10.0-beta
 */

module.exports = {
	async up(queryInterface, DataTypes) {
		await queryInterface.createTable('playlists', {
			id: {
				type: DataTypes.INTEGER,
				autoIncrement: true,
				primaryKey: true,
			},
			userId: { type: DataTypes.STRING, allowNull: false },
			name: { type: DataTypes.STRING, allowNull: false },
			shareCode: { type: DataTypes.STRING, allowNull: true, unique: true },
			createdAt: { type: DataTypes.DATE, allowNull: false },
			updatedAt: { type: DataTypes.DATE, allowNull: false },
		});
	},
	async down(queryInterface) {
		await queryInterface.dropTable('playlists');
	},
};
