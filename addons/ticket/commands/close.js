/**
 * @namespace: addons/ticket/commands/close.js
 * @type: Command
 * @copyright © 2025 kenndeclouv
 * @assistant chaa & graa
 * @version 0.11.0-beta
 */

const { closeTicket, MessageFlags } = require('../helpers');

module.exports = {
	subcommand: true,
	slashCommand: (subcommand) =>
		subcommand
			.setName('close')
			.setDescription('Close the ticket and delete the ticket channel.'),

	async execute(interaction, container) {
		const { models, t, helpers } = container;
		const { Ticket, TicketConfig } = models;
		const { simpleContainer } = helpers.discord;
		const ticket = await Ticket.getCache({
			channelId: interaction.channel.id,
			status: 'open',
		});

		if (!ticket) {
			const desc = await t(interaction, 'ticket.errors.not_a_ticket');
			return interaction.reply({
				components: await simpleContainer(interaction, desc, { color: 'Red' }),
				flags: MessageFlags.IsComponentsV2 | MessageFlags.Ephemeral,
			});
		}

		const ticketConfig = await TicketConfig.getCache({
			id: ticket.ticketConfigId,
		});
		if (!ticketConfig) {
			const desc = await t(interaction, 'ticket.errors.config_missing');
			return interaction.reply({
				components: await simpleContainer(interaction, desc, { color: 'Red' }),
				flags: MessageFlags.IsComponentsV2 | MessageFlags.Ephemeral,
			});
		}
		await closeTicket(interaction, container);
	},
};
