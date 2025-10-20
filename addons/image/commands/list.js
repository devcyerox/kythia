/**
 * @namespace: addons/image/commands/list.js
 * @type: Command
 * @copyright © 2025 kenndeclouv
 * @assistant chaa & graa
 * @version 0.9.9-beta-rc.4
 */

const { ContainerBuilder, TextDisplayBuilder, SeparatorBuilder, SeparatorSpacingSize, MessageFlags } = require('discord.js');

const convertColor = require('@utils/color');
const Image = require('../database/models/Image');
const { t } = require('@utils/translator');

module.exports = {
    subcommand: true,
    data: (subcommand) => subcommand.setName('list').setDescription('List all your uploaded images'),
    async execute(interaction) {
        await interaction.deferReply({ flags: MessageFlags.Ephemeral });

        let images = await Image.getAllCache({
            where: { userId: interaction.user.id },
        });

        if (!Array.isArray(images)) {
            images = Array.isArray(images?.rows) ? images.rows : [];
        }
        if (!images.length) {
            return interaction.editReply(await t(interaction, 'image_commands_list_empty'));
        }
        const baseUrl = kythia.addons.dashboard.url || 'https://localhost:3000';

        const items = images.map((img) => ({
            code: img.filename,
            url: `${baseUrl}/files/${img.storagePath}`,
        }));
        const color = convertColor(kythia.bot.color, { from: 'hex', to: 'decimal' });

        const chunkSize = 25;
        for (let i = 0; i < items.length; i += chunkSize) {
            const pageItems = items.slice(i, i + chunkSize);

            const container = new ContainerBuilder()
                .setAccentColor(color)
                .addTextDisplayComponents(
                    new TextDisplayBuilder().setContent(
                        i === 0
                            ? await t(interaction, 'image_commands_list_title')
                            : await t(interaction, 'image_commands_list_title_contd')
                    )
                )
                .addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true));

            for (const img of pageItems) {
                container.addTextDisplayComponents(
                    new TextDisplayBuilder().setContent(
                        await t(interaction, 'image_commands_list_item', { code: img.code, url: img.url })
                    )
                );
                container.addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(false));
            }

            if (i + chunkSize >= items.length) {
                container.addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true));
                container.addTextDisplayComponents(
                    new TextDisplayBuilder().setContent(
                        await t(interaction, "image_commands_list_footer_help")
                    )
                );
            }
            container
                .addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true))
                .addTextDisplayComponents(
                    new TextDisplayBuilder().setContent(
                        await t(interaction, 'common_container_footer', { username: interaction.client.user.username })
                    )
                );

            if (i === 0) {
                await interaction.editReply({
                    components: [container],
                    flags: MessageFlags.IsPersistent | MessageFlags.IsComponentsV2,
                });
            } else {
                await interaction.followUp({
                    components: [container],
                    flags: MessageFlags.IsPersistent | MessageFlags.IsComponentsV2,
                });
            }
        }
    },
};
