/**
 * @namespace: addons/core/events/autoModerationActionExecution.js
 * @type: Event Handler
 * @copyright © 2025 kenndeclouv
 * @assistant chaa & graa
 * @version 0.11.0-beta
 */

const { EmbedBuilder } = require('discord.js');

module.exports = async (bot, execution) => {
	const container = bot.container;
	const { t, models } = container;
	const { ServerSetting } = models;

	const guildId = execution.guild.id;
	const ruleName = execution.ruleTriggerType.toString();

	const settings = await ServerSetting.getCache({
		guildId: guildId,
	});
	const locale = execution.guild.preferredLocale || 'en';

	if (!settings || !settings.modLogChannelId) {
		return;
	}

	const logChannelId = settings.modLogChannelId;
	const logChannel = await execution.guild.channels
		.fetch(logChannelId)
		.catch(() => null);

	if (logChannel?.isTextBased()) {
		const embed = new EmbedBuilder()
			.setColor('Red')
			.setDescription(
				await t(
					execution.guild,
					'common.automod',
					{
						ruleName: ruleName,
					},
					locale,
				),
			)
			.addFields(
				{
					name: await t(
						execution.guild,
						'common.automod.field.user',
						{},
						locale,
					),
					value: `${execution.user?.tag} (${execution.userId})`,
					inline: true,
				},
				{
					name: await t(
						execution.guild,
						'common.automod.field.rule.trigger',
						{},
						locale,
					),
					value: `\`${ruleName}\``,
					inline: true,
				},
			)
			.setFooter({
				text: await t(
					execution.guild,
					'common.embed.footer',
					{
						username: execution.guild.client.user.username,
					},
					locale,
				),
			})
			.setTimestamp();

		await logChannel.send({ embeds: [embed] });
	}
};
