/**
 * @namespace: addons/economy/register.js
 * @type: Module
 * @copyright © 2025 kenndeclouv
 * @assistant chaa & graa
 * @version 0.9.10-beta
 */

// addons/dashboard/register.js

const logger = require('@coreHelpers/logger');
const { initializeOrderProcessing } = require('./helpers/orderProcessor');
module.exports = {
    async initialize(bot) {
        const summery = [];
        initializeOrderProcessing();
        summery.push('   └─ Task: Order processing');
        return summery;
    },
};
