/**
 * @namespace: addons/adventure/database/migrations/20251120_000001_create_inventory_adventures_table.js
 * @type: Database Migration
 * @copyright © 2025 kenndeclouv
 * @assistant chaa & graa
 * @version 0.10.0-beta
 */

module.exports = {
	async up(queryInterface, DataTypes) {
		await queryInterface.createTable('inventory_adventures', {
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
			itemName: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			quantity: {
				type: DataTypes.INTEGER,
				defaultValue: 1,
				allowNull: false,
			},
			// Timestamps (createdAt/updatedAt) TIDAK DIBUAT
			// karena di original code 'timestamps: false'
		});

		// 🔥 Optional Best Practice:
		// User gak boleh punya item yang sama di row berbeda (harus di-stack quantity-nya)
		await queryInterface.addIndex(
			'inventory_adventures',
			['userId', 'itemName'],
			{
				unique: true,
				name: 'unique_inventory_stack',
			},
		);
	},

	async down(queryInterface) {
		await queryInterface.dropTable('inventory_adventures');
	},
};
