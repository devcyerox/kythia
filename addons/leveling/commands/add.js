/**
 * @namespace: addons/leveling/commands/add.js
 * @type: Command
 * @copyright © 2025 kenndeclouv
 * @assistant chaa & graa
 * @version 0.11.0-beta
 */
const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
	subcommand: true,
	permissions: [PermissionFlagsBits.ManageGuild],
	slashCommand: (subcommand) =>
		subcommand
			.setName('add')
			.setDescription('Add levels to a user.')
			.addUserOption((option) =>
				option
					.setName('user')
					.setDescription('The user to add levels to.')
					.setRequired(true),
			)
			.addIntegerOption((option) =>
				option
					.setName('level')
					.setDescription('The amount of levels to add.')
					.setRequired(true),
			),

	async execute(interaction, container) {
		const { t, models, helpers } = container;
		const { embedFooter } = helpers.discord;
		const { User } = models;

		await interaction.deferReply({ ephemeral: true });

		const targetUser = interaction.options.getUser('user');
		const levelToAdd = interaction.options.getInteger('level');
		const user = await User.getCache({
			userId: targetUser.id,
			guildId: interaction.guild.id,
		});

		if (!user) {
			const embed = new EmbedBuilder()
				.setColor('Red')
				.setDescription(
					`## ${await t(interaction, 'leveling.xp-set.leveling.user.not.found.title')}\n${await t(interaction, 'leveling.xp-set.leveling.user.not.found.desc')}`,
				)
				.setFooter(await embedFooter(interaction));
			return interaction.editReply({ embeds: [embed] });
		}

		user.level += levelToAdd;
		user.xp = 0;
		user.changed('level', true);
		user.changed('xp', true);
		await user.saveAndUpdateCache('userId');

		const embed = new EmbedBuilder()
			.setColor(kythia.bot.color)
			.setDescription(
				`## ${await t(interaction, 'leveling.add.leveling.add.title')}\n` +
					(await t(interaction, 'leveling.add.leveling.add.desc', {
						username: targetUser.username,
						level: levelToAdd,
						newLevel: user.level,
					})),
			)
			.setTimestamp()
			.setFooter(await embedFooter(interaction));

		return interaction.editReply({ embeds: [embed] });
	},
};
