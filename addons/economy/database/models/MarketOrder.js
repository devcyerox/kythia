/**
 * @namespace: addons/economy/database/models/MarketOrder.js
 * @type: Model
 * @copyright © 2025 kenndeclouv
 * @assistant chaa & graa
 * @version 0.9.9-beta-rc.3
 */
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const MarketOrder = sequelize.define(
        'MarketOrder',
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
                type: DataTypes.STRING, // 'limit' or 'stoploss'
                allowNull: false,
            },
            side: {
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
            status: {
                type: DataTypes.STRING, // 'open', 'filled', 'cancelled'
                defaultValue: 'open',
            },
        },
        {
            timestamps: true,
        }
    );

    return MarketOrder;
};
