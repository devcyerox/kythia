/**
 * @namespace: addons/invite/commands/leaderboard.js
 * @type: Command
 * @copyright © 2025 kenndeclouv
 * @assistant chaa & graa
 * @version 0.10.1-beta
 */

const {
	ButtonBuilder,
	ButtonStyle,
	ActionRowBuilder,
	SeparatorSpacingSize,
	ContainerBuilder,
	TextDisplayBuilder,
	SeparatorBuilder,
	MessageFlags,
} = require('discord.js');

const USERS_PER_PAGE = 10;
const MAX_USERS = 100;

async function buildNavButtons(
	interaction,
	page,
	totalPages,
	allDisabled = false,
) {
	const { t } = interaction.client.container;
	return [
		new ButtonBuilder()
			.setCustomId('leaderboard_first')
			.setLabel(await t(interaction, 'economy.leaderboard.nav.first'))
			.setStyle(ButtonStyle.Secondary)
			.setDisabled(allDisabled || page <= 1),
		new ButtonBuilder()
			.setCustomId('leaderboard_prev')
			.setLabel(await t(interaction, 'economy.leaderboard.nav.prev'))
			.setStyle(ButtonStyle.Primary)
			.setDisabled(allDisabled || page <= 1),
		new ButtonBuilder()
			.setCustomId('leaderboard_next')
			.setLabel(await t(interaction, 'economy.leaderboard.nav.next'))
			.setStyle(ButtonStyle.Primary)
			.setDisabled(allDisabled || page >= totalPages),
		new ButtonBuilder()
			.setCustomId('leaderboard_last')
			.setLabel(await t(interaction, 'economy.leaderboard.nav.last'))
			.setStyle(ButtonStyle.Secondary)
			.setDisabled(allDisabled || page >= totalPages),
	];
}

async function generateLeaderboardContainer(
	interaction,
	page,
	topUsers,
	totalUsers,
	navDisabled = false,
) {
	const { t, kythiaConfig, helpers } = interaction.client.container;
	const { convertColor } = helpers.color;

	const totalPages = Math.max(1, Math.ceil(totalUsers / USERS_PER_PAGE));
	page = Math.max(1, Math.min(page, totalPages));

	const startIndex = (page - 1) * USERS_PER_PAGE;
	const pageUsers = topUsers.slice(startIndex, startIndex + USERS_PER_PAGE);

	let leaderboardText = '';
	if (pageUsers.length === 0) {
		leaderboardText = await t(
			interaction,
			'invite.invite.command.leaderboard.empty',
		);
	} else {
		const lines = await Promise.all(
			pageUsers.map(async (row, index) => {
				const rank = startIndex + index + 1;
				return await t(interaction, 'invite.invite.command.leaderboard.line', {
					rank: rank,
					user: `<@${row.userId}>`,
					invites: row.invites || 0,
				});
			}),
		);
		leaderboardText = lines.join('\n');
	}

	const navButtons = await buildNavButtons(
		interaction,
		page,
		totalPages,
		navDisabled,
	);

	const title = await t(interaction, 'invite.invite.command.title');

	const leaderboardContainer = new ContainerBuilder()
		.setAccentColor(
			convertColor(kythiaConfig.bot.color, { from: 'hex', to: 'decimal' }),
		)
		.addTextDisplayComponents(
			new TextDisplayBuilder().setContent(`## ${title}`),
		)
		.addSeparatorComponents(
			new SeparatorBuilder()
				.setSpacing(SeparatorSpacingSize.Small)
				.setDivider(true),
		)
		.addTextDisplayComponents(
			new TextDisplayBuilder().setContent(leaderboardText),
		)
		.addSeparatorComponents(
			new SeparatorBuilder()
				.setSpacing(SeparatorSpacingSize.Small)
				.setDivider(true),
		)
		.addTextDisplayComponents(
			new TextDisplayBuilder().setContent(
				await t(interaction, 'common.container.footer', {
					username: interaction.client.user.username,
					extra: `Total Inviters: ${totalUsers}`,
				}),
			),
		)
		.addActionRowComponents(
			new ActionRowBuilder().addComponents(...navButtons),
		);

	return { leaderboardContainer, page, totalPages };
}

module.exports = {
	subcommand: true,
	data: (subcommand) =>
		subcommand
			.setName('leaderboard')
			.setDescription('View top inviters leaderboard'),

	async execute(interaction, container) {
		const { models } = container;
		const { Invite } = models;
		const guildId = interaction.guild.id;

		await interaction.deferReply();

		const allInviters = await Invite.getAllCache({
			where: { guildId },
			order: [['invites', 'DESC']],
			limit: MAX_USERS,
			cacheTags: [`Invite:leaderboard:${guildId}`],
		});

		const totalUsers = allInviters.length;
		let currentPage = 1;

		if (totalUsers === 0) {
			const { leaderboardContainer } = await generateLeaderboardContainer(
				interaction,
				1,
				[],
				0,
				true,
			);
			return interaction.editReply({
				components: [leaderboardContainer],
				allowedMentions: {
					parse: [],
				},
				flags: MessageFlags.IsComponentsV2,
			});
		}

		const { leaderboardContainer, totalPages } =
			await generateLeaderboardContainer(
				interaction,
				currentPage,
				allInviters,
				totalUsers,
			);

		const message = await interaction.editReply({
			components: [leaderboardContainer],
			allowedMentions: {
				parse: [],
			},
			fetchReply: true,
			flags: MessageFlags.IsComponentsV2,
		});

		if (totalPages <= 1) return;

		const collector = message.createMessageComponentCollector({
			filter: (i) => i.user.id === interaction.user.id,
			time: 300000,
		});

		collector.on('collect', async (i) => {
			if (i.customId === 'leaderboard_first') {
				currentPage = 1;
			} else if (i.customId === 'leaderboard_prev') {
				currentPage = Math.max(1, currentPage - 1);
			} else if (i.customId === 'leaderboard_next') {
				currentPage = Math.min(totalPages, currentPage + 1);
			} else if (i.customId === 'leaderboard_last') {
				currentPage = totalPages;
			}

			const { leaderboardContainer: newContainer } =
				await generateLeaderboardContainer(
					i,
					currentPage,
					allInviters,
					totalUsers,
				);

			await i.update({
				components: [newContainer],
				allowedMentions: {
					parse: [],
				},
			});
		});

		collector.on('end', async () => {
			try {
				const { leaderboardContainer: finalContainer } =
					await generateLeaderboardContainer(
						interaction,
						currentPage,
						allInviters,
						totalUsers,
						true,
					);

				await message.edit({
					components: [finalContainer],
					allowedMentions: {
						parse: [],
					},
				});
			} catch (_error) {}
		});
	},
};
