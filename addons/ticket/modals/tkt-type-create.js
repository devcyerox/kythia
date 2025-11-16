/**
 * @namespace: addons/ticket/modals/tkt-type-create.js
 * @type: Module
 * @copyright © 2025 kenndeclouv
 * @assistant chaa & graa
 * @version 0.9.12-beta
 */

const { ContainerBuilder, TextDisplayBuilder, SeparatorBuilder, MessageFlags, SeparatorSpacingSize } = require('discord.js');
const { refreshTicketPanel } = require('../helpers'); // "Sihir"

// Utility: Simple container builder (partial, for quick error/success)
async function simpleContainer(interaction, desc, opts = {}) {
    const { helpers } = interaction.container ?? {};
    const color = opts.color || 'Gray';
    const { convertColor } = helpers?.color ?? { convertColor: () => 0x808080 };
    return [
        new ContainerBuilder()
            .setAccentColor(convertColor(color, { from: 'discord', to: 'decimal' }))
            .addTextDisplayComponents(new TextDisplayBuilder().setContent(desc)),
    ];
}

module.exports = {
    execute: async (interaction, container) => {
        const { redis, kythiaConfig, t, helpers, models } = container;
        const { convertColor } = helpers.color;
        const { TicketConfig } = models;

        try {
            // 1. Ambil panelMessageId dari customId
            const panelMessageId = interaction.customId.split(':')[1];
            if (!panelMessageId) {
                const desc = await t?.(interaction, 'ticket.errors.no_panel_id');
                return interaction.reply({
                    components: await simpleContainer(interaction, desc, { color: 'Red' }),
                    flags: MessageFlags.IsComponentsV2 | MessageFlags.Ephemeral,
                });
            }

            // 2. Ambil SEMUA data dari 'fields'
            // Dari TextInput
            const typeName = interaction.fields.getTextInputValue('typeName');

            // Dari RoleSelectMenu
            const staffRoleId = interaction.fields.getSelectedRoles('staffRoleId')?.first()?.id;

            // Dari ChannelSelectMenu
            const logsChannelId = interaction.fields.getSelectedChannels('logsChannelId')?.first()?.id;
            const transcriptChannelId = interaction.fields.getSelectedChannels('transcriptChannelId')?.first()?.id;
            const ticketCategoryId = interaction.fields.getSelectedChannels('ticketCategoryId')?.first()?.id; // opsional

            // (Data opsional dari modal sebelumnya udah gak ada,
            //  kita harus tambahin lagi ke Mega Modal kalo perlu)
            const typeEmoji = interaction.fields.getTextInputValue('typeEmoji');
            const ticketOpenMessage = interaction.fields.getTextInputValue('ticketOpenMessage');
            const ticketOpenImage = interaction.fields.getTextInputValue('ticketOpenImage');

            // 3. Validasi (PENTING!)
            if (!staffRoleId || !logsChannelId || !transcriptChannelId) {
                const desc = await t?.(
                    interaction,
                    'ticket.errors.mega_modal_missing',
                    '❌ Role Staff, Log, and Transcript channels are required.'
                );
                return interaction.reply({
                    components: await simpleContainer(interaction, desc, { color: 'Red' }),
                    flags: MessageFlags.IsComponentsV2 | MessageFlags.Ephemeral,
                });
            }

            // 4. Simpen ke DB TicketConfig
            await TicketConfig.create({
                guildId: interaction.guild.id,
                panelMessageId: panelMessageId,
                typeName: typeName,
                typeEmoji: typeEmoji || null,
                staffRoleId: staffRoleId,
                logsChannelId: logsChannelId,
                transcriptChannelId: transcriptChannelId,
                ticketCategoryId: ticketCategoryId || null,
                ticketOpenMessage: ticketOpenMessage || null,
                ticketOpenImage: ticketOpenImage || null,
            });

            // 5. PANGGIL SIHIR (Panel Refresher)
            await refreshTicketPanel(panelMessageId, container);

            // 6. Hapus cache (Kalo kita pake cache, tapi di sini gak pake)
            // await redis.del(cacheKey);

            // 7. Bales sukses (Pake reply supaya view v2 ilang)
            const descSuccess = await t(interaction, 'ticket.type_create.success', { typeName: typeName });
            await interaction.reply({
                components: await simpleContainer(interaction, descSuccess, { color: 'Green' }),
                flags: MessageFlags.IsComponentsV2 | MessageFlags.Ephemeral,
            });
        } catch (error) {
            console.error('Error in tkt-type-create (Mega Modal) handler:', error);
            // Optional: simple error handler display
            try {
                const errDesc = '❌ An unknown error occurred. Please try again.';
                if (interaction.replied || interaction.deferred) {
                    await interaction.followUp({
                        components: await simpleContainer(interaction, errDesc, { color: 'Red' }),
                        flags: MessageFlags.IsComponentsV2 | MessageFlags.Ephemeral,
                    });
                } else {
                    await interaction.reply({
                        components: await simpleContainer(interaction, errDesc, { color: 'Red' }),
                        flags: MessageFlags.IsComponentsV2 | MessageFlags.Ephemeral,
                    });
                }
            } catch {
                /* ignore double error */
            }
        }
    },
};
