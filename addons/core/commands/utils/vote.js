/**
 * @namespace: addons/core/commands/utils/vote.js
 * @type: Command
 * @copyright © 2025 kenndeclouv
 * @assistant chaa & graa
 * @version 0.9.10-beta
 */
const {
    SlashCommandBuilder,
    ButtonBuilder,
    ButtonStyle,
    ActionRowBuilder,
    SeparatorSpacingSize,
    ContainerBuilder,
    TextDisplayBuilder,
    SeparatorBuilder,
    MessageFlags,
    MediaGalleryItemBuilder,
    MediaGalleryBuilder,
} = require('discord.js');
const { t } = require('@coreHelpers/translator');
const convertColor = require('@utils/color');

module.exports = {
    data: new SlashCommandBuilder().setName('vote').setDescription(`❤️ Vote for ${kythia.bot.name} on top.gg!`),
    async execute(interaction) {
        const components = [
            new ContainerBuilder()
                .setAccentColor(convertColor(kythia.bot.color, { from: 'hex', to: 'decimal' }))
                .addMediaGalleryComponents(
                    new MediaGalleryBuilder().addItems([new MediaGalleryItemBuilder().setURL(kythia.settings.bannerImage)])
                )
                .addTextDisplayComponents(
                    new TextDisplayBuilder().setContent(
                        await t(interaction, 'core.utils.vote.container.title', { username: interaction.client.user.username })
                    )
                )
                .addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true))
                .addTextDisplayComponents(
                    new TextDisplayBuilder().setContent(
                        await t(interaction, 'core.utils.vote.container.desc', { username: interaction.client.user.username })
                    )
                )
                .addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true))
                .addActionRowComponents(
                    new ActionRowBuilder().addComponents(
                        new ButtonBuilder()
                            .setStyle(ButtonStyle.Link)
                            .setLabel(await t(interaction, 'core.utils.vote.button.topgg', { username: interaction.client.user.username }))
                            .setURL(`https://top.gg/bot/${kythia.bot.clientId}/vote`)
                    )
                )
                .addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true))

                .addTextDisplayComponents(
                    new TextDisplayBuilder().setContent(
                        await t(interaction, 'common.container.footer', { username: interaction.client.user.username })
                    )
                ),
        ];

        await interaction.reply({
            components: components,
            flags: MessageFlags.IsPersistent | MessageFlags.IsComponentsV2,
        });
    },
};
