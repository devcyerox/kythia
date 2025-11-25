/**
 * @namespace: addons/economy/database/migrations/20251122_000020_create_market_orders_table.js
 * @type: Database Migration
 * @copyright © 2025 kenndeclouv
 * @assistant chaa & graa
 * @version 0.10.0-beta
 */

module.exports = {
	async up(queryInterface, DataTypes) {
		await queryInterface.createTable('market_orders', {
			orderId: {
				type: DataTypes.INTEGER,
				autoIncrement: true,
				primaryKey: true,
			},
			userId: { type: DataTypes.STRING, allowNull: false },
			assetId: { type: DataTypes.STRING, allowNull: false },
			type: { type: DataTypes.STRING, allowNull: false }, // 'limit' or 'stoploss'
			side: { type: DataTypes.STRING, allowNull: false }, // 'buy' or 'sell'
			quantity: { type: DataTypes.DOUBLE, allowNull: false },
			price: { type: DataTypes.DOUBLE, allowNull: false },
			status: {
				type: DataTypes.STRING,
				allowNull: false,
				defaultValue: 'open',
			},

			createdAt: { type: DataTypes.DATE, allowNull: false },
			updatedAt: { type: DataTypes.DATE, allowNull: false },
		});

		await queryInterface.addIndex('market_orders', ['userId']);
		await queryInterface.addIndex('market_orders', ['userId', 'assetId']);
	},

	async down(queryInterface) {
		await queryInterface.dropTable('market_orders');
	},
};
