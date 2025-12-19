const { MessageFlags } = require('discord.js');

module.exports = {
	name: 'teamOnly',
	priority: 14,

	/**
	 * @param {import('discord.js').Interaction} interaction
	 * @param {any} command
	 * @param {KythiaDI.Container} container
	 * @returns {Promise<boolean>}
	 */
	async execute(interaction, command, container) {
		if (!command.teamOnly) return true;
		if (container.helpers.discord.isOwner(interaction.user.id)) return true;

		const isTeamMember = await container.helpers.discord.isTeam(
			container,
			interaction.user.id,
		);

		if (!isTeamMember) {
			if (interaction.isRepliable()) {
				await interaction.reply({
					content: await container.t(interaction, 'common.error.not.team'),
					flags: MessageFlags.Ephemeral,
				});
			}
			return false;
		}
		return true;
	},
};
