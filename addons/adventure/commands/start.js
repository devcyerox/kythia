/**
 * @namespace: addons/adventure/commands/start.js
 * @type: Command
 * @copyright © 2025 kenndeclouv
 * @assistant chaa & graa
 * @version 0.11.0-beta
 */
const {
	MessageFlags,
	ContainerBuilder,
	SeparatorBuilder,
	TextDisplayBuilder,
	MediaGalleryBuilder,
	SeparatorSpacingSize,
	MediaGalleryItemBuilder,
} = require('discord.js');
const characters = require('../helpers/characters');

module.exports = {
	subcommand: true,
	slashCommand: (subcommand) => {
		const chars = characters.getAllCharacters();
		return subcommand
			.setName('start')
			.setNameLocalizations({ id: 'mulai', fr: 'demarrer', ja: 'スタート' })
			.setDescription('🛩️ Start your journey now!')
			.setDescriptionLocalizations({
				id: '🛩️ Mulai petualanganmu sekarang!',
				fr: '🛩️ Commence ton aventure maintenant !',
				ja: '🛩️ 今すぐ冒険を始めよう！',
			})
			.addStringOption((option) =>
				option
					.setName('character')
					.setDescription('Choose your starting character!')
					.setRequired(true)
					.addChoices(
						...chars.map((char) => ({
							name: `${char.emoji} ${char.name}`,
							value: char.id,
						})),
					),
			);
	},
	async execute(interaction) {
		const container = interaction.client.container;
		const { t, models, kythiaConfig, helpers } = container;
		const { UserAdventure } = models;
		const { createContainer } = helpers.discord;
		const { convertColor } = helpers.color;

		await interaction.deferReply();

		const existing = await UserAdventure.getCache({
			userId: interaction.user.id,
		});

		if (existing) {
			const msg = await t(interaction, 'adventure.start.already.have');

			const components = await createContainer(interaction, {
				description: msg,
				color: 'Red',
			});
			return interaction.editReply({
				components,
				flags: MessageFlags.IsComponentsV2,
			});
		}

		const charId = interaction.options.getString('character');
		const selected = characters.getChar(charId);

		if (!selected) {
			const msg = await t(interaction, 'adventure.start.invalid_char');
			const components = await createContainer(interaction, {
				description: msg,
				color: 'Red',
			});
			return interaction.editReply({
				components,
				flags: MessageFlags.IsComponentsV2,
			});
		}

		const level = 1;
		const xp = 0;
		let baseHp = 100;
		const gold = 50;
		let strength = 10;
		let defense = 5;

		strength += selected.strengthBonus;
		defense += selected.defenseBonus;
		baseHp = Math.floor(baseHp * (1 + (selected.hpBonusPercent || 0) / 100));

		await UserAdventure.create({
			userId: interaction.user.id,
			level,
			xp,
			hp: baseHp,
			maxHp: baseHp,
			gold,
			strength,
			defense,
			characterId: selected.id,
		});

		const charStatsString = await t(
			interaction,
			'adventure.start.choose.char.stats',
			{
				str: `${strength - selected.strengthBonus} (${selected.strengthBonus >= 0 ? '+' : ''}${selected.strengthBonus})`,
				def: `${defense - selected.defenseBonus} (${selected.defenseBonus >= 0 ? '+' : ''}${selected.defenseBonus})`,
				hp: `100% (${selected.hpBonusPercent >= 0 ? '+' : ''}${selected.hpBonusPercent}%)`,
				xp: `0% (${selected.xpBonusPercent >= 0 ? '+' : ''}${selected.xpBonusPercent}%)`,
				gold: `0% (${selected.goldBonusPercent >= 0 ? '+' : ''}${selected.goldBonusPercent}%)`,
			},
		);

		const colorInput = kythiaConfig.bot.color;
		const defaultAccent = convertColor(colorInput, {
			from: 'hex',
			to: 'decimal',
		});
		let accentColor = defaultAccent;

		const isHex = /^#?([0-9A-Fa-f]{6})$/.test(colorInput);
		if (isHex) {
			accentColor = convertColor(colorInput, { from: 'hex', to: 'decimal' });
		} else {
			try {
				accentColor = convertColor(colorInput, {
					from: 'discord',
					to: 'decimal',
				});
			} catch (_e) {
				accentColor = defaultAccent;
			}
		}

		const startContainer = new ContainerBuilder().setAccentColor(accentColor);

		startContainer.addMediaGalleryComponents(
			new MediaGalleryBuilder().addItems([
				new MediaGalleryItemBuilder().setURL(
					interaction.user.displayAvatarURL({ dynamic: true, size: 512 }),
				),
			]),
		);

		startContainer.addTextDisplayComponents(
			new TextDisplayBuilder().setContent(
				`## ${await t(interaction, 'adventure.start.success.title')}\n${await t(interaction, 'adventure.start.success.desc')}`,
			),
		);

		startContainer.addSeparatorComponents(
			new SeparatorBuilder()
				.setSpacing(SeparatorSpacingSize.Small)
				.setDivider(true),
		);

		startContainer.addTextDisplayComponents(
			new TextDisplayBuilder().setContent(
				`**${await t(interaction, 'adventure.start.selected.char')}**\n${selected.emoji} **${await t(interaction, selected.nameKey)}**\n*${await t(interaction, selected.descKey)}*`,
			),
		);

		startContainer.addSeparatorComponents(
			new SeparatorBuilder()
				.setSpacing(SeparatorSpacingSize.Small)
				.setDivider(true),
		);

		startContainer.addTextDisplayComponents(
			new TextDisplayBuilder().setContent(charStatsString),
		);

		startContainer.addSeparatorComponents(
			new SeparatorBuilder()
				.setSpacing(SeparatorSpacingSize.Small)
				.setDivider(true),
		);

		startContainer.addTextDisplayComponents(
			new TextDisplayBuilder().setContent(
				await t(interaction, 'common.container.footer', {
					username: interaction.client.user.username,
				}),
			),
		);

		return interaction.editReply({
			components: [startContainer],
			flags: MessageFlags.IsComponentsV2,
		});
	},
};
