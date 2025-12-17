/**
 * @namespace: addons/leveling/commands/profile.js
 * @type: Command
 * @copyright © 2025 kenndeclouv
 * @assistant chaa & graa
 * @version 0.11.0-beta
 */
const {
	ContainerBuilder,
	TextDisplayBuilder,
	SeparatorBuilder,
	SeparatorSpacingSize,
	MediaGalleryBuilder,
	MediaGalleryItemBuilder,
	MessageFlags,
} = require('discord.js');
const { generateLevelImage, levelUpXp } = require('../helpers');

module.exports = {
	subcommand: true,
	slashCommand: (subcommand) =>
		subcommand
			.setName('profile')
			.setDescription("Check your or another user's level profile.")
			.addUserOption((option) =>
				option
					.setName('user')
					.setDescription('The user whose profile you want to see.'),
			),

	async execute(interaction, container) {
		const { t, models, kythiaConfig, helpers } = container;
		const { User } = models;
		const { convertColor } = helpers.color;

		await interaction.deferReply();

		const targetUser = interaction.options.getUser('user') || interaction.user;

		let user = await User.getCache({
			userId: targetUser.id,
			guildId: interaction.guild.id,
		});

		// Handle User Baru
		if (!user) {
			user = await User.create({
				userId: targetUser.id,
				guildId: interaction.guild.id,
				xp: 0,
				level: 1,
			});

			// Tampilkan pesan "Profile Created" pake Container sederhana
			const title = `## ${await t(interaction, 'leveling.profile.leveling.profile.created.title')}`;
			const desc = await t(
				interaction,
				'leveling.profile.leveling.profile.created.desc',
			);
			const footerText = await t(interaction, 'common.container.footer', {
				username: interaction.client.user.username,
			});

			const accentColor = convertColor('Yellow', {
				from: 'discord',
				to: 'decimal',
			});

			const createdContainer = new ContainerBuilder()
				.setAccentColor(accentColor)
				.addTextDisplayComponents(new TextDisplayBuilder().setContent(title))
				.addSeparatorComponents(
					new SeparatorBuilder()
						.setSpacing(SeparatorSpacingSize.Small)
						.setDivider(true),
				)
				.addTextDisplayComponents(new TextDisplayBuilder().setContent(desc))
				.addSeparatorComponents(
					new SeparatorBuilder()
						.setSpacing(SeparatorSpacingSize.Small)
						.setDivider(true),
				)
				.addTextDisplayComponents(
					new TextDisplayBuilder().setContent(footerText),
				);

			return interaction.editReply({
				components: [createdContainer],
				flags: MessageFlags.IsComponentsV2,
			});
		}

		// Generate Image
		const imageName = 'level-profile.png';
		const buffer = await generateLevelImage({
			username: targetUser.username,
			avatarURL: targetUser.displayAvatarURL({ extension: 'png', size: 256 }),
			level: user.level,
			xp: user.xp,
			nextLevelXp: levelUpXp(user.level),
			backgroundURL: kythiaConfig.addons.leveling.backgroundUrl,
		});

		// 🔥 BUILD PROFILE CONTAINER
		const botColor = convertColor(kythiaConfig.bot.color, {
			from: 'hex',
			to: 'decimal',
		});

		const titleText = `## ${await t(interaction, 'leveling.profile.leveling.profile.title')}`;
		const descText = await t(
			interaction,
			'leveling.profile.leveling.profile.desc',
			{
				username: targetUser.username,
				level: user.level || 0,
				xp: user.xp || 0,
				nextLevelXp: levelUpXp(user.level),
			},
		);

		const footerText = await t(interaction, 'common.container.footer', {
			username: interaction.client.user.username,
		});

		const profileContainer = new ContainerBuilder()
			.setAccentColor(botColor)
			// Header
			.addTextDisplayComponents(new TextDisplayBuilder().setContent(titleText))
			.addSeparatorComponents(
				new SeparatorBuilder()
					.setSpacing(SeparatorSpacingSize.Small)
					.setDivider(true),
			)
			// Stats
			.addTextDisplayComponents(new TextDisplayBuilder().setContent(descText))
			// Image
			.addMediaGalleryComponents(
				new MediaGalleryBuilder().addItems([
					new MediaGalleryItemBuilder().setURL(`attachment://${imageName}`),
				]),
			)
			// Footer
			.addSeparatorComponents(
				new SeparatorBuilder()
					.setSpacing(SeparatorSpacingSize.Small)
					.setDivider(true),
			)
			.addTextDisplayComponents(
				new TextDisplayBuilder().setContent(footerText),
			);

		// Kirim Reply dengan Attachment
		await interaction.editReply({
			components: [profileContainer],
			files: [{ attachment: buffer, name: imageName }],
			flags: MessageFlags.IsComponentsV2,
		});
	},
};
