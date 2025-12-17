/**
 * @namespace: addons/image/commands/delete.js
 * @type: Command
 * @copyright © 2025 kenndeclouv
 * @assistant chaa & graa
 * @version 0.11.0-beta
 */

const { EmbedBuilder, MessageFlags } = require('discord.js');
const fs = require('node:fs').promises;
const path = require('node:path');

module.exports = {
	subcommand: true,
	slashCommand: (subcommand) =>
		subcommand
			.setName('delete')
			.setDescription('Delete an image by its code')
			.addStringOption((option) =>
				option
					.setName('code')
					.setDescription('The code of the image to delete')
					.setRequired(true),
			),
	async execute(interaction, container) {
		const { models, t, kythiaConfig } = container;
		const { Image } = models;

		await interaction.deferReply({ flags: MessageFlags.Ephemeral });

		const code = interaction.options.getString('code');

		const image = await Image.getCache({
			userId: interaction.user.id,
			filename: code,
		});

		if (!image) {
			const embed = new EmbedBuilder()
				.setColor(kythiaConfig.bot.color)
				.setDescription(
					`${await t(interaction, 'image.delete.not.found.desc')}`,
				);
			return await interaction.editReply({ embeds: [embed], ephemeral: true });
		}

		const filePath = path.join(process.cwd(), 'storage', image.storagePath);
		try {
			await fs.unlink(filePath);
		} catch (err) {
			if (err.code !== 'ENOENT') {
				const embed = new EmbedBuilder()
					.setColor(kythiaConfig.bot.color)
					.setDescription(`${await t(interaction, 'image.delete.error.desc')}`);
				return await interaction.editReply({
					embeds: [embed],
					ephemeral: true,
				});
			}
		}

		await image.destroy();

		const embed = new EmbedBuilder()
			.setColor(kythiaConfig.bot.color)
			.setDescription(`${await t(interaction, 'image.delete.success.desc')}`);
		await interaction.editReply({ embeds: [embed], ephemeral: true });
	},
};
