/**
 * @namespace: addons/dashboard/database/migrations/20251122_000017_create_visitors_table.js
 * @type: Database Migration
 * @copyright © 2025 kenndeclouv
 * @assistant chaa & graa
 * @version 0.10.0-beta
 */

module.exports = {
	async up(queryInterface, DataTypes) {
		await queryInterface.createTable('visitors', {
			id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
			ipHash: { type: DataTypes.STRING, allowNull: false },
			visitDate: { type: DataTypes.DATEONLY },
		});

		await queryInterface.addIndex('visitors', ['ipHash', 'visitDate'], {
			unique: true,
			name: 'unique_visitor_daily',
		});
	},

	async down(queryInterface) {
		await queryInterface.dropTable('visitors');
	},
};
