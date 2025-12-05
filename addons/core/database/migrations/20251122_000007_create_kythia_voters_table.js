/**
 * @namespace: addons/core/database/migrations/20251122_000007_create_kythia_voters_table.js
 * @type: Database Migration
 * @copyright © 2025 kenndeclouv
 * @assistant chaa & graa
 * @version 0.10.1-beta
 */

module.exports = {
	async up(queryInterface, DataTypes) {
		await queryInterface.createTable('kythia_voters', {
			userId: {
				type: DataTypes.STRING,
				allowNull: false,
				primaryKey: true,
			},
			votedAt: {
				type: DataTypes.DATE,
				allowNull: false,
			},
		});
	},

	async down(queryInterface) {
		await queryInterface.dropTable('kythia_voters');
	},
};
