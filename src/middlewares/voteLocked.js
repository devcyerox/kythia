const {
	ContainerBuilder,
	TextDisplayBuilder,
	SeparatorBuilder,
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	MessageFlags,
	SeparatorSpacingSize,
} = require('discord.js');

module.exports = {
	name: 'voteLocked',
	priority: 15,

	/**
	 * @param {import('discord.js').Interaction} interaction
	 * @param {any} command
	 * @param {KythiaDI.Container} container
	 * @returns {Promise<boolean>}
	 */
	async execute(interaction, command, container) {
		if (!command.voteLocked) return true;
		if (container.helpers.discord.isOwner(interaction.user.id)) return true;

		console.log(container);
		const { kythiaConfig, t, helpers } = container;
		const { KythiaVoter } = container.models;
		const { convertColor } = helpers.color;

		const voter = await KythiaVoter.getCache({
			userId: interaction.user.id,
		});
		const twelveHoursAgo = new Date(Date.now() - 12 * 60 * 60 * 1000);

		if (!voter || new Date(voter.votedAt) < twelveHoursAgo) {
			const errContainer = new ContainerBuilder().setAccentColor(
				convertColor(kythiaConfig.bot.color, {
					from: 'hex',
					to: 'decimal',
				}),
			);

			errContainer.addTextDisplayComponents(
				new TextDisplayBuilder().setContent(
					await t(interaction, 'common.error.vote.locked.text'),
				),
			);

			errContainer.addSeparatorComponents(
				new SeparatorBuilder()
					.setSpacing(SeparatorSpacingSize.Small)
					.setDivider(true),
			);

			errContainer.addActionRowComponents(
				new ActionRowBuilder().addComponents(
					new ButtonBuilder()
						.setLabel(
							await t(interaction, 'common.error.vote.locked.button', {
								username: interaction.client.user.username,
							}),
						)
						.setStyle(ButtonStyle.Link)
						.setURL(`https://top.gg/bot/${kythiaConfig.bot.clientId}/vote`),
				),
			);

			errContainer.addSeparatorComponents(
				new SeparatorBuilder()
					.setSpacing(SeparatorSpacingSize.Small)
					.setDivider(true),
			);

			errContainer.addTextDisplayComponents(
				new TextDisplayBuilder().setContent(
					await t(interaction, 'common.container.footer', {
						username: interaction.client.user.username,
					}),
				),
			);

			if (interaction.isRepliable()) {
				await interaction.reply({
					components: [errContainer],
					flags: MessageFlags.IsComponentsV2,
				});
			}
			return false;
		}

		return true;
	},
};
