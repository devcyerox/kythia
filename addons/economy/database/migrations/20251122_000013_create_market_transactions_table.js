/**
 * @namespace: addons/economy/database/migrations/20251122_000013_create_market_transactions_table.js
 * @type: Database Migration
 * @copyright © 2025 kenndeclouv
 * @assistant chaa & graa
 * @version 0.10.1-beta
 */

module.exports = {
	async up(queryInterface, DataTypes) {
		await queryInterface.createTable('market_transactions', {
			transactionId: {
				type: DataTypes.INTEGER,
				autoIncrement: true,
				primaryKey: true,
			},
			userId: { type: DataTypes.STRING, allowNull: false },
			assetId: { type: DataTypes.STRING, allowNull: false },
			type: { type: DataTypes.STRING, allowNull: false }, // 'buy' or 'sell'
			quantity: { type: DataTypes.DOUBLE, allowNull: false },
			price: { type: DataTypes.DOUBLE, allowNull: false },

			// Timestamps (createdAt, updatedAt) karena timestamps: true di model
			createdAt: { type: DataTypes.DATE, allowNull: false },
			updatedAt: { type: DataTypes.DATE, allowNull: false },
		});

		// Indexes
		await queryInterface.addIndex('market_transactions', ['userId']);
		await queryInterface.addIndex('market_transactions', ['userId', 'assetId']);
	},

	async down(queryInterface) {
		await queryInterface.dropTable('market_transactions');
	},
};
