/**
 * @namespace: addons/core/commands/utils/leaveguild.js
 * @type: Command
 * @copyright © 2025 kenndeclouv
 * @assistant chaa & graa
 * @version 0.10.0-beta
 */

const {
	SlashCommandBuilder,
	ContainerBuilder,
	TextDisplayBuilder,
	SeparatorBuilder,
	SeparatorSpacingSize,
	MessageFlags,
	InteractionContextType,
} = require('discord.js');

module.exports = {
	aliases: ['lg'],
	data: new SlashCommandBuilder()
		.setName('leaveguild')
		.setDescription('Force Kythia to leave a specific guild (Owner Only).')
		.addStringOption((option) =>
			option
				.setName('guild_id')
				.setDescription('The ID of the guild to leave')
				.setRequired(true)
				.setAutocomplete(true),
		)
		.setContexts(InteractionContextType.BotDM),
	isOwner: true,
	async autocomplete(interaction) {
		const focusedValue = interaction.options.getFocused();
		const guilds = interaction.client.guilds.cache;

		const filtered = guilds.filter(
			(guild) =>
				guild.name.toLowerCase().includes(focusedValue.toLowerCase()) ||
				guild.id.includes(focusedValue),
		);

		const choices = filtered
			.map((guild) => ({
				name: `${guild.name} (${guild.id})`.slice(0, 100),
				value: guild.id,
			}))
			.slice(0, 25);

		await interaction.respond(choices);
	},
	async execute(interaction, container) {
		const { kythiaConfig, helpers } = container;
		const { convertColor } = helpers.color;
		const { simpleContainer } = helpers.discord;
		const { client } = interaction;

		const guildId = interaction.options.getString('guild_id');
		const guild = client.guilds.cache.get(guildId);

		if (!guild) {
			const msg = `❌ **Guild Not Found**\nI couldn't find a guild with ID \`${guildId}\` in my cache.`;
			const components = await simpleContainer(interaction, msg, {
				color: 'Red',
			});
			return interaction.reply({
				components,
				flags: MessageFlags.Ephemeral | MessageFlags.IsComponentsV2,
			});
		}

		const guildName = guild.name;
		const memberCount = guild.memberCount;

		try {
			await guild.leave();

			const mainContainer = new ContainerBuilder().setAccentColor(
				convertColor(kythiaConfig.bot.color, { from: 'hex', to: 'decimal' }),
			);

			const desc = `✅ **Successfully Left Guild**\n\n**Name:** ${guildName}\n**ID:** \`${guildId}\`\n**Members:** ${memberCount}`;

			mainContainer.addTextDisplayComponents(
				new TextDisplayBuilder().setContent(desc),
			);

			mainContainer.addSeparatorComponents(
				new SeparatorBuilder()
					.setSpacing(SeparatorSpacingSize.Small)
					.setDivider(true),
			);

			mainContainer.addTextDisplayComponents(
				new TextDisplayBuilder().setContent(
					`📉 Server Count is now: **${client.guilds.cache.size}**`,
				),
			);

			await interaction.reply({
				components: [mainContainer],
				flags: MessageFlags.Ephemeral | MessageFlags.IsComponentsV2,
			});
		} catch (error) {
			console.error(`[ForceLeave] Failed to leave guild ${guildId}:`, error);

			const msg = `⚠️ **Error Leaving Guild**\n\`\`\`js\n${error.message}\n\`\`\``;
			const components = await simpleContainer(interaction, msg, {
				color: 'Red',
			});
			await interaction.reply({
				components,
				flags: MessageFlags.Ephemeral | MessageFlags.IsComponentsV2,
			});
		}
	},
};
