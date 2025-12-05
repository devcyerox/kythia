/**
 * @namespace: addons/core/database/migrations/20251122_000012_create_user_afks_table.js
 * @type: Database Migration
 * @copyright © 2025 kenndeclouv
 * @assistant chaa & graa
 * @version 0.10.1-beta
 */

module.exports = {
	async up(queryInterface, DataTypes) {
		await queryInterface.createTable('user_afks', {
			id: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				autoIncrement: true,
				allowNull: false,
			},
			userId: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			reason: {
				type: DataTypes.STRING,
				allowNull: false,
				defaultValue: 'No reason provided.',
			},
			timestamp: {
				type: DataTypes.DATE,
				allowNull: false,
			},
		});

		await queryInterface.addIndex('user_afks', ['userId'], {
			name: 'user_afks_userId',
		});
	},

	async down(queryInterface) {
		await queryInterface.dropTable('user_afks');
	},
};
