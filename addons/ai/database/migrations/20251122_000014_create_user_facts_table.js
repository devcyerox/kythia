/**
 * @namespace: addons/ai/database/migrations/20251122_000014_create_user_facts_table.js
 * @type: Database Migration
 * @copyright © 2025 kenndeclouv
 * @assistant chaa & graa
 * @version 0.10.0-beta
 */

module.exports = {
	async up(queryInterface, DataTypes) {
		await queryInterface.createTable('user_facts', {
			id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
			userId: { type: DataTypes.STRING, allowNull: false },
			fact: { type: DataTypes.TEXT, allowNull: false },
			type: { type: DataTypes.STRING, allowNull: false, defaultValue: 'other' },

			createdAt: { type: DataTypes.DATE, allowNull: false },
			updatedAt: { type: DataTypes.DATE, allowNull: false },
		});
	},

	async down(queryInterface) {
		await queryInterface.dropTable('user_facts');
	},
};
