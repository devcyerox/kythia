/**
 * @namespace: addons/core/database/migrations/20251122_000001_create_users_table.js
 * @type: Database Migration
 * @copyright © 2025 kenndeclouv
 * @assistant chaa & graa
 * @version 0.11.0-beta
 */

module.exports = {
	async up(queryInterface, DataTypes) {
		await queryInterface.createTable('users', {
			id: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				autoIncrement: true,
				allowNull: false,
			},
			guildId: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			userId: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			level: {
				type: DataTypes.INTEGER,
				defaultValue: 1,
			},
			xp: {
				type: DataTypes.INTEGER,
				defaultValue: 1,
			},
			lastMessage: {
				type: DataTypes.DATE,
				defaultValue: null,
			},
			warnings: {
				type: DataTypes.JSON,
				defaultValue: '[]',
			},
		});

		// Index for cache keys
		await queryInterface.addIndex('users', ['userId', 'guildId'], {
			name: 'users_userId_guildId',
		});
	},

	async down(queryInterface) {
		await queryInterface.dropTable('users');
	},
};
