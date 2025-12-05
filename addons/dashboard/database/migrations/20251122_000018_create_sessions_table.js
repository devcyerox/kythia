/**
 * @namespace: addons/dashboard/database/migrations/20251122_000018_create_sessions_table.js
 * @type: Database Migration
 * @copyright © 2025 kenndeclouv
 * @assistant chaa & graa
 * @version 0.10.1-beta
 */

module.exports = {
	async up(queryInterface, DataTypes) {
		await queryInterface.createTable('sessions', {
			sid: { type: DataTypes.STRING, primaryKey: true },
			expires: { type: DataTypes.DATE },
			data: { type: DataTypes.TEXT },

			createdAt: { type: DataTypes.DATE, allowNull: false },
			updatedAt: { type: DataTypes.DATE, allowNull: false },
		});
	},

	async down(queryInterface) {
		await queryInterface.dropTable('sessions');
	},
};
