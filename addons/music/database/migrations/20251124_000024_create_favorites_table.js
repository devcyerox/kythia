/**
 * @namespace: addons/music/database/migrations/20251124_000024_create_favorites_table.js
 * @type: Database Migration
 * @copyright © 2025 kenndeclouv
 * @assistant chaa & graa
 * @version 0.10.1-beta
 */

module.exports = {
	async up(queryInterface, DataTypes) {
		await queryInterface.createTable('favorites', {
			id: {
				type: DataTypes.INTEGER,
				autoIncrement: true,
				primaryKey: true,
			},
			userId: { type: DataTypes.STRING, allowNull: false },
			identifier: { type: DataTypes.STRING, allowNull: false },
			title: { type: DataTypes.STRING, allowNull: false },
			author: { type: DataTypes.STRING, allowNull: false },
			length: { type: DataTypes.BIGINT, allowNull: false },
			uri: { type: DataTypes.STRING, allowNull: false },
			createdAt: { type: DataTypes.DATE, allowNull: false },
			updatedAt: { type: DataTypes.DATE, allowNull: false },
		});

		await queryInterface.addIndex('favorites', ['userId', 'identifier'], {
			unique: true,
		});
	},
	async down(queryInterface) {
		await queryInterface.dropTable('favorites');
	},
};
