/**
 * @namespace: addons/giveaway/register.js
 * @type: Module
 * @copyright © 2025 kenndeclouv
 * @assistant chaa & graa
 * @version 0.9.12-beta
 */

const GiveawayManager = require('./helpers/GiveawayManager');

module.exports = {
    async initialize(bot) {
        const container = bot.client.container;
        const summary = [];

        // 1. INSTANCE DIBUAT SEKARANG (Biar Button Handler gak error)
        container.giveawayManager = new GiveawayManager(container);

        // 2. Register Button (Aman karena container.giveaway udah ada)
        bot.registerButtonHandler('giveaway_join', container.giveawayManager.handleJoin.bind(container.giveawayManager));
        summary.push("   └─ Button: 'giveaway_join'");

        // 3. JALANKAN SCHEDULER SAAT READY (Biar DB aman)
        bot.addClientReadyHook(async () => {
            // Init dipanggil nanti saat bot & DB udah siap 100%
            await container.giveawayManager.init();
        });

        summary.push('   └─ 🎁 Giveaway Manager (Scheduler Queued)');

        return summary;
    },
};
