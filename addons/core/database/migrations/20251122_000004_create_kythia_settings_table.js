/**
 * @namespace: addons/core/database/migrations/20251122_000004_create_kythia_settings_table.js
 * @type: Database Migration
 * @copyright © 2025 kenndeclouv
 * @assistant chaa & graa
 * @version 0.11.0-beta
 */

module.exports = {
	async up(queryInterface, DataTypes) {
		await queryInterface.createTable('kythia_settings', {
			id: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				autoIncrement: true,
				allowNull: false,
			},
			guildId: {
				type: DataTypes.STRING,
				allowNull: true,
			},
		});

		await queryInterface.addIndex('kythia_settings', ['guildId'], {
			name: 'kythia_settings_guildId',
		});
	},

	async down(queryInterface) {
		await queryInterface.dropTable('kythia_settings');
	},
};
