/**
 * @namespace: addons/pet/commands/admin/delete.js
 * @type: Command
 * @copyright © 2025 kenndeclouv
 * @assistant chaa & graa
 * @version 0.11.0-beta
 */
const { EmbedBuilder } = require('discord.js');

module.exports = {
	slashCommand: (subcommand) =>
		subcommand
			.setName('delete')
			.setDescription('Delete a pet from the system')
			.addStringOption((option) =>
				option
					.setName('name')
					.setDescription('Name of the pet to delete')
					.setRequired(true),
			),
	subcommand: true,
	teamOnly: true,
	async execute(interaction, container) {
		const { t, models, helpers } = container;
		const { embedFooter } = helpers.discord;
		const { Pet } = models;

		await interaction.deferReply();

		const name = interaction.options.getString('name');
		const deleted = await Pet.destroy({ where: { name } });
		if (deleted) {
			const embed = new EmbedBuilder()
				.setDescription(
					`## ${await t(interaction, 'pet.admin.delete.delete.success.title')}\n${await t(interaction, 'pet.admin.delete.delete.success.desc', { name })}`,
				)
				.setColor(kythia.bot.color)
				.setFooter(await embedFooter(interaction));
			return interaction.editReply({ embeds: [embed] });
		} else {
			const embed = new EmbedBuilder()
				.setDescription(
					`## ${await t(interaction, 'pet.admin.delete.delete.notfound.title')}\n${await t(interaction, 'pet.admin.delete.delete.notfound.desc')}`,
				)
				.setColor('Red')
				.setFooter(await embedFooter(interaction));
			return interaction.editReply({ embeds: [embed] });
		}
	},
};
