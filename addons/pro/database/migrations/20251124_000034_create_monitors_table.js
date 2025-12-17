/**
 * @namespace: addons/pro/database/migrations/20251124_000034_create_monitors_table.js
 * @type: Database Migration
 * @copyright © 2025 kenndeclouv
 * @assistant chaa & graa
 * @version 0.11.0-beta
 */

module.exports = {
	async up(queryInterface, DataTypes) {
		await queryInterface.createTable('monitors', {
			userId: {
				type: DataTypes.STRING,
				primaryKey: true,
				allowNull: false,
			},
			urlToPing: { type: DataTypes.STRING, allowNull: false },
			lastStatus: {
				type: DataTypes.ENUM('UP', 'DOWN', 'PENDING'),
				defaultValue: 'PENDING',
			},
		});
	},
	async down(queryInterface) {
		await queryInterface.dropTable('monitors');
	},
};
