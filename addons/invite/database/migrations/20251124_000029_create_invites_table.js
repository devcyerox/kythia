/**
 * @namespace: addons/invite/database/migrations/20251124_000029_create_invites_table.js
 * @type: Database Migration
 * @copyright © 2025 kenndeclouv
 * @assistant chaa & graa
 * @version 0.10.0-beta
 */

module.exports = {
	async up(queryInterface, DataTypes) {
		await queryInterface.createTable('invites', {
			id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
			guildId: { type: DataTypes.STRING, allowNull: false },
			userId: { type: DataTypes.STRING, allowNull: false },
			invites: { type: DataTypes.INTEGER, defaultValue: 0 },
			fake: { type: DataTypes.INTEGER, defaultValue: 0 },
			leaves: { type: DataTypes.INTEGER, defaultValue: 0 },
		});

		await queryInterface.addIndex('invites', ['guildId', 'userId'], {
			unique: true,
		});
	},
	async down(queryInterface) {
		await queryInterface.dropTable('invites');
	},
};
