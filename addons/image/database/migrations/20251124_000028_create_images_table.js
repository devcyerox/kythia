/**
 * @namespace: addons/image/database/migrations/20251124_000028_create_images_table.js
 * @type: Database Migration
 * @copyright © 2025 kenndeclouv
 * @assistant chaa & graa
 * @version 0.10.1-beta
 */

module.exports = {
	async up(queryInterface, DataTypes) {
		await queryInterface.createTable('images', {
			id: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				autoIncrement: true,
			},
			userId: { type: DataTypes.STRING, allowNull: false },
			filename: { type: DataTypes.STRING, allowNull: false, unique: true },
			originalUrl: { type: DataTypes.TEXT, allowNull: false },
			storagePath: { type: DataTypes.STRING, allowNull: false },
			mimetype: { type: DataTypes.STRING, allowNull: false },
			createdAt: { type: DataTypes.DATE, allowNull: false },
			updatedAt: { type: DataTypes.DATE, allowNull: false },
		});

		await queryInterface.addIndex('images', ['userId']);
		await queryInterface.addIndex('images', ['filename']);
	},
	async down(queryInterface) {
		await queryInterface.dropTable('images');
	},
};
