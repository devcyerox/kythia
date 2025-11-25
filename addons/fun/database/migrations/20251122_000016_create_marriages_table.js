/**
 * @namespace: addons/fun/database/migrations/20251122_000016_create_marriages_table.js
 * @type: Database Migration
 * @copyright © 2025 kenndeclouv
 * @assistant chaa & graa
 * @version 0.10.0-beta
 */

module.exports = {
	async up(queryInterface, DataTypes) {
		await queryInterface.createTable('marriages', {
			id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
			user1Id: { type: DataTypes.STRING, allowNull: false },
			user2Id: { type: DataTypes.STRING, allowNull: false },
			marriedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
			status: {
				type: DataTypes.ENUM('pending', 'married', 'divorced', 'rejected'),
				defaultValue: 'pending',
			},
			lastKiss: { type: DataTypes.DATE, allowNull: true },
			loveScore: { type: DataTypes.INTEGER, defaultValue: 0 },
		});
	},

	async down(queryInterface) {
		await queryInterface.dropTable('marriages');
	},
};
