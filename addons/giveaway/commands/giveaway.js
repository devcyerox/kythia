/**
 * @namespace: addons/giveaway/commands/giveaway.js
 * @type: Command
 * @copyright © 2025 kenndeclouv
 * @assistant chaa & graa
 * @version 0.9.12-beta
 */

const { SlashCommandBuilder, PermissionFlagsBits, InteractionContextType } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('giveaway')
        .setDescription('🎉 Create a giveaway event')
        .addSubcommand((subcommand) =>
            subcommand
                .setName('start')
                .setDescription('Start a giveaway')
                .addStringOption((o) => o.setName('duration').setDescription('Duration (1d 2h)').setRequired(true))
                .addIntegerOption((o) => o.setName('winners').setDescription('Count').setRequired(true))
                .addStringOption((o) => o.setName('prize').setDescription('Prize').setRequired(true))
                .addStringOption((o) => o.setName('color').setDescription('Hex Color').setRequired(false))
                .addRoleOption((o) => o.setName('role').setDescription('Req Role').setRequired(false))
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName('end')
                .setDescription('End giveaway')
                .addStringOption((o) => o.setName('message_id').setDescription('ID').setRequired(true))
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName('cancel')
                .setDescription('Cancel a giveaway')
                .addStringOption((o) => o.setName('message_id').setDescription('ID').setRequired(true))
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName('reroll')
                .setDescription('Reroll giveaway winners')
                .addStringOption((o) => o.setName('message_id').setDescription('ID').setRequired(true))
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
        .setContexts(InteractionContextType.Guild),

    async execute(interaction, container) {
        const { giveawayManager } = container;
        const subcommand = interaction.options.getSubcommand();

        if (subcommand === 'start') {
            return giveawayManager.createGiveaway(interaction);
        }
        if (subcommand === 'end') {
            return giveawayManager.endGiveaway(interaction.options.getString('message_id'), interaction);
        }
        if (subcommand === 'cancel') {
            return giveawayManager.cancelGiveaway(interaction.options.getString('message_id'), interaction);
        }
        if (subcommand === 'reroll') {
            return giveawayManager.rerollGiveaway(interaction.options.getString('message_id'), interaction);
        }
    },
};
