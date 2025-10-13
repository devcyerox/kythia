/**
 * @namespace: addons/economy/database/models/MarketTransaction.js
 * @type: Model
 * @copyright © 2025 kenndeclouv
 * @assistant chaa & graa
 * @version 0.9.9-beta-rc.3
 */
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const MarketTransaction = sequelize.define(
        'MarketTransaction',
        {
            userId: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            assetId: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            type: {
                type: DataTypes.STRING, // 'buy' or 'sell'
                allowNull: false,
            },
            quantity: {
                type: DataTypes.FLOAT,
                allowNull: false,
            },
            price: {
                type: DataTypes.FLOAT,
                allowNull: false,
            },
        },
        {
            timestamps: true,
        }
    );

    return MarketTransaction;
};
