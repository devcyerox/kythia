/**
 * @namespace: addons/giveaway/buttons/giveawayjoin.js
 * @type: Module
 * @copyright © 2025 kenndeclouv
 * @assistant chaa & graa
 * @version 0.9.10-beta
 */

const { updateGiveawayMessage } = require('../helpers/giveawayManager');
const Giveaway = require('../database/models/Giveaway');
const { t } = require('@coreHelpers/translator');

module.exports = {
    // Tambahkan 'container' untuk konsistensi
    execute: async (interaction, container) => {
        await interaction.deferReply({ ephemeral: true });

        const messageId = interaction.message.id;
        const giveaway = await Giveaway.getCache({ messageId: messageId });

        if (!giveaway || giveaway.ended) {
            return interaction.editReply({ content: await t(interaction, 'giveaway.buttons.giveawayjoin.error.ended') });
        }

        // Cek role requirement
        if (giveaway.roleId) {
            if (!interaction.member.roles.cache.has(giveaway.roleId)) {
                return interaction.editReply({
                    content: await t(interaction, 'giveaway.buttons.giveawayjoin.error.role.required', { role: giveaway.roleId }),
                });
            }
        }

        const participants = JSON.parse(giveaway.participants || '[]');
        const userIndex = participants.indexOf(interaction.user.id);

        // Toggle join/unjoin
        if (userIndex > -1) {
            participants.splice(userIndex, 1);
            await interaction.editReply({ content: await t(interaction, 'giveaway.buttons.giveawayjoin.response.unjoin') });
        } else {
            participants.push(interaction.user.id);
            await interaction.editReply({ content: await t(interaction, 'giveaway.buttons.giveawayjoin.response.join') });
        }

        giveaway.participants = JSON.stringify(participants);
        await giveaway.saveAndUpdateCache('messageId');

        // Update embed utama dengan jumlah peserta baru
        await updateGiveawayMessage(interaction.client, giveaway);
    },
};
