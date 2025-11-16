/**
 * @namespace: addons/ticket/select_menus/tkt-type-panel.js
 * @type: Module
 * @copyright © 2025 kenndeclouv
 * @assistant chaa & graa
 * @version 0.9.12-beta
 */

const {
    ModalBuilder,
    LabelBuilder,
    TextInputBuilder,
    TextInputStyle,
    RoleSelectMenuBuilder,
    ChannelSelectMenuBuilder,
    ChannelType,
    MessageFlags,
} = require('discord.js');

module.exports = {
    execute: async (interaction, container) => {
        const { t, helpers } = container;
        const { simpleContainer } = helpers.discord;

        try {
            const selectedPanelMessageId = interaction.values[0];

            const megaModal = new ModalBuilder()

                .setCustomId(`tkt-type-create:${selectedPanelMessageId}`)
                .setTitle('Create New Ticket Type')

                .addLabelComponents(
                    new LabelBuilder()
                        .setLabel('Nama Tipe Tiket (Label di Menu)')
                        .setTextInputComponent(
                            new TextInputBuilder()
                                .setCustomId('typeName')
                                .setStyle(TextInputStyle.Short)
                                .setPlaceholder('e.g. Laporan Bug')
                                .setRequired(true)
                        ),

                    new LabelBuilder()
                        .setLabel('Pilih Role Staff')
                        .setRoleSelectMenuComponent(
                            new RoleSelectMenuBuilder()
                                .setCustomId('staffRoleId')
                                .setPlaceholder('Pilih satu role...')
                                .setMinValues(1)
                                .setMaxValues(1)
                        ),

                    new LabelBuilder()
                        .setLabel('Pilih Channel Log')
                        .setChannelSelectMenuComponent(
                            new ChannelSelectMenuBuilder()
                                .setCustomId('logsChannelId')
                                .setPlaceholder('Pilih satu channel...')
                                .addChannelTypes(ChannelType.GuildText)
                                .setMinValues(1)
                                .setMaxValues(1)
                        ),

                    new LabelBuilder()
                        .setLabel('Pilih Channel Transcript')
                        .setChannelSelectMenuComponent(
                            new ChannelSelectMenuBuilder()
                                .setCustomId('transcriptChannelId')
                                .setPlaceholder('Pilih satu channel...')
                                .addChannelTypes(ChannelType.GuildText)
                                .setMinValues(1)
                                .setMaxValues(1)
                        ),

                    new LabelBuilder()
                        .setLabel('Pilih Kategori Tiket (Opsional)')
                        .setChannelSelectMenuComponent(
                            new ChannelSelectMenuBuilder()
                                .setCustomId('ticketCategoryId')
                                .setPlaceholder('Pilih kategori (opsional)...')
                                .addChannelTypes(ChannelType.GuildCategory)
                                .setRequired(false)
                                .setMinValues(0)
                                .setMaxValues(1)
                        )
                );

            await interaction.showModal(megaModal);
        } catch (error) {
            console.error('Error in tkt-type-panel handler (Mega Modal):', error);
            if (!interaction.replied && !interaction.deferred) {
                const desc = await t(interaction, 'ticket.errors.modal_show_failed_mega');
                await interaction.reply({
                    components: await simpleContainer(interaction, desc, { color: 'Red' }),
                    flags: MessageFlags.IsComponentsV2 | MessageFlags.Ephemeral,
                });
            }
        }
    },
};
