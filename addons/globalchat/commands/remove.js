/**
 * @namespace: addons/globalchat/commands/remove.js
 * @type: Command
 * @copyright © 2025 kenndeclouv
 * @assistant chaa & graa
 * @version 0.9.9-beta-rc.5
 */

const { EmbedBuilder, MessageFlags } = require('discord.js');
const fetch = require('node-fetch');
const { embedFooter } = require('@utils/discord');
const { t } = require('@utils/translator');
const GlobalChat = require('../database/models/GlobalChat.js');

module.exports = {
    subcommand: true,
    data: (subcommand) => subcommand.setName('remove').setDescription('Remove this server from the global chat network'),
    async execute(interaction, container) {
        const { logger } = container;
        const apiUrl = kythia?.addons?.globalchat?.apiUrl;

        await interaction.deferReply();

        let localDbChat = await GlobalChat.getCache({ guildId: interaction.guild.id });
        if (localDbChat) {
            await localDbChat.destroy();
        }

        try {
            const res = await fetch(`${apiUrl}/remove/${interaction.guild.id}`, {
                method: 'DELETE',
            });
            const resJson = await res.json();

            if (resJson.status === 'ok') {
                const embed = new EmbedBuilder()
                    .setColor('Green')
                    .setDescription(await t(interaction, 'globalchat.remove.success'))
                    .setFooter(await embedFooter(interaction))
                    .setTimestamp(new Date());
                return interaction.editReply({ embeds: [embed] });
            } else if (resJson.code === 'GUILD_NOT_FOUND') {
                const embed = new EmbedBuilder().setColor('Orange').setDescription(await t(interaction, 'globalchat.remove.not.found'));
                return interaction.editReply({ embeds: [embed], flags: MessageFlags.Ephemeral });
            } else {
                const embed = new EmbedBuilder().setColor('Red').setDescription(await t(interaction, 'globalchat.remove.failed'));
                return interaction.editReply({ embeds: [embed], flags: MessageFlags.Ephemeral });
            }
        } catch (error) {
            logger.error('Failed to remove guild from global chat via API:', error);
            const embed = new EmbedBuilder().setColor('Red').setDescription(await t(interaction, 'globalchat.remove.error'));
            return interaction.editReply({ embeds: [embed], flags: MessageFlags.Ephemeral });
        }
    },
};
