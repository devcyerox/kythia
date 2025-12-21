/**
 * @namespace: addons/streak/commands/claim.js
 * @type: Command
 * @copyright © 2025 kenndeclouv
 * @assistant chaa & graa
 * @version 0.11.0-beta
 */

const { MessageFlags } = require('discord.js');
const { claimStreak } = require('../helpers');

module.exports = {
	subcommand: true,
	slashCommand: (subcommand) =>
		subcommand
			.setName('claim')
			.setDescription(
				'🔥 Claim your streak for today, keep your streak continue!',
			),
	/**
	 * @param {import('discord.js').ChatInputCommandInteraction} interaction
	 * @param {KythiaDI.Container} container
	 */
	async execute(interaction, container) {
		const { t, models, helpers } = container;
		const { ServerSetting } = models;
		const { simpleContainer } = helpers.discord;

		const guildId = interaction.guild.id;
		const serverSetting = await ServerSetting.getCache({ guildId });
		const streakEmoji = serverSetting.streakEmoji || '🔥';

		await interaction.deferReply();

		const { status, streak, rewardRolesGiven } = await claimStreak(
			container,
			interaction.member,
			serverSetting,
		);

		if (status === 'ALREADY_CLAIMED') {
			const msg = `${await t(interaction, 'streak.streak.claim.already.title')}\n ${await t(
				interaction,
				'streak.streak.claim.already.desc',
				{
					streak: streak.currentStreak,
					emoji: streakEmoji,
				},
			)}`;
			const components = await simpleContainer(interaction, msg, {
				color: 'Red',
			});
			return interaction.editReply({
				components,
				flags: MessageFlags.IsComponentsV2,
			});
		}

		let message;
		if (status === 'FREEZE_USED') {
			message = await t(interaction, 'streak.streak.claim.freeze.used', {
				streakFreezes: streak.streakFreezes,
			});
		} else if (status === 'CONTINUE') {
			message = await t(interaction, 'streak.streak.claim.continue');
		} else {
			message = await t(interaction, 'streak.streak.claim.new.streak');
		}

		let rewardMsg = '';
		if (rewardRolesGiven.length > 0) {
			const roleMentions = rewardRolesGiven.map((roleId) => {
				const role = interaction.guild.roles.cache.get(roleId);
				return role ? `<@&${role.id}>` : `Role ID: ${roleId}`;
			});
			rewardMsg = `${await t(interaction, 'streak.streak.claim.reward', {
				roles: roleMentions.join(', '),
			})}`;
		}

		const title = await t(interaction, 'streak.streak.claim.title');
		const finalMessage = `## ${title}\n${message}\n${rewardMsg}\n${await t(
			interaction,
			'streak.streak.claim.desc',
			{
				currentStreak: streak.currentStreak,
				highestStreak: streak.highestStreak,
				streakFreezes: streak.streakFreezes,
				emoji: streakEmoji,
			},
		)}`;
		const components = await simpleContainer(interaction, finalMessage);
		return interaction.editReply({
			components,
			flags: MessageFlags.IsComponentsV2,
		});
	},
};
