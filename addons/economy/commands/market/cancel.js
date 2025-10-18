/**
 * @namespace: addons/economy/commands/market/cancel.js
 * @type: Command
 * @copyright © 2025 kenndeclouv
 * @assistant chaa & graa
 * @version 0.9.9-beta-rc.4
 */
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const KythiaUser = require('@coreModels/KythiaUser');
const MarketOrder = require('../../database/models/MarketOrder');
const MarketPortfolio = require('../../database/models/MarketPortfolio');
const { t } = require('@utils/translator');
const { embedFooter } = require('@utils/discord');

module.exports = {
    subcommand: true,
    data: (subcommand) =>
        subcommand
            .setName('cancel')
            .setDescription('Cancel an open order.')
            .addStringOption((option) => option.setName('order_id').setDescription('The ID of the order to cancel').setRequired(true)),

    async execute(interaction) {
        await interaction.deferReply();
        const orderId = interaction.options.getString('order_id');

        try {
            const order = await MarketOrder.getCache({ id: orderId, userId: interaction.user.id, status: 'open' });

            if (!order) {
                const notFoundEmbed = new EmbedBuilder()
                    .setColor('Red')
                    .setDescription(
                        `## ${await t(interaction, 'economy_market_cancel_not_found_title')}\n${await t(interaction, 'economy_market_cancel_not_found_desc')}`
                    );
                return interaction.editReply({ embeds: [notFoundEmbed] });
            }

            if (order.side === 'buy') {
                const user = await KythiaUser.getCache({ userId: interaction.user.id });
                const totalCost = order.quantity * order.price;

                user.kythiaCoin = BigInt(user.kythiaCoin) + BigInt(totalCost);

                user.changed('kythiaCoin', true);

                await user.saveAndUpdateCache();
            } else {
                const portfolio = await MarketPortfolio.getCache({ userId: interaction.user.id, assetId: order.assetId });
                if (portfolio) {
                    portfolio.quantity += order.quantity;
                    await portfolio.save();
                } else {
                    await MarketPortfolio.create({
                        userId: interaction.user.id,
                        assetId: order.assetId,
                        quantity: order.quantity,
                        avgBuyPrice: 0,
                    });
                }
            }

            order.status = 'cancelled';
            await order.save();

            const successEmbed = new EmbedBuilder()
                .setColor('Green')
                .setDescription(
                    `## ${await t(interaction, 'economy_market_cancel_success_title')}\n${await t(interaction, 'economy_market_cancel_success_desc', { orderId: order.id })}`
                );
            await interaction.editReply({ embeds: [successEmbed] });
        } catch (error) {
            console.error('Error in cancel order:', error);
            const errorEmbed = new EmbedBuilder()
                .setColor('Red')
                .setDescription(
                    `## ${await t(interaction, 'economy_market_cancel_error_title')}\n${await t(interaction, 'economy_market_cancel_error_desc')}`
                );
            await interaction.editReply({ embeds: [errorEmbed] });
        }
    },
};
