/**
 * @namespace: addons/core/commands/utils/about.js
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
    data: new SlashCommandBuilder().setName('about').setDescription(`😋 A brief introduction about ${kythia.bot.name}`),
    async execute(interaction) {
        const components = [
            new ContainerBuilder()
                .setAccentColor(convertColor(kythia.bot.color, { from: 'hex', to: 'decimal' }))

                .addTextDisplayComponents(
                    new TextDisplayBuilder().setContent(
                        await t(interaction, 'core.utils.about.embed.title', { username: interaction.client.user.username })
                    )
                )
                .addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true))
                .addTextDisplayComponents(
                    new TextDisplayBuilder().setContent(
                        await t(interaction, 'core.utils.about.embed.desc', { username: interaction.client.user.username })
                    )
                )
                .addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true))
                .addActionRowComponents(
                    new ActionRowBuilder().addComponents(
                        new ButtonBuilder()
                            .setStyle(ButtonStyle.Link)
                            .setLabel(await t(interaction, 'core.utils.about.button.invite'))
                            .setURL(
                                `https://discord.com/oauth2/authorize?client_id=${interaction.client.user.id}&permissions=8&scope=bot+applications.commands`
                            ),
                        new ButtonBuilder()
                            .setStyle(ButtonStyle.Link)
                            .setLabel(await t(interaction, 'core.utils.about.button.website'))
                            .setURL(kythia.settings.kythiaWeb),
                        new ButtonBuilder()
                            .setStyle(ButtonStyle.Link)
                            .setLabel(await t(interaction, 'core.utils.about.button.owner.web'))
                            .setURL(kythia.settings.ownerWeb)
                    )
                )
                .addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true))
                .addMediaGalleryComponents(
                    new MediaGalleryBuilder().addItems([new MediaGalleryItemBuilder().setURL(kythia.settings.bannerImage)])
                )
                .addTextDisplayComponents(new TextDisplayBuilder().setContent(await t(interaction, 'core.utils.about.embed.footer'))),
        ];

        await interaction.reply({
            components: components,
            flags: MessageFlags.IsPersistent | MessageFlags.IsComponentsV2,
        });
    },
};
