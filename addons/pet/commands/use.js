/**
 * @namespace: addons/pet/commands/use.js
 * @type: Command
 * @copyright © 2025 kenndeclouv
 * @assistant chaa & graa
 * @version 0.11.0-beta
 */
const { EmbedBuilder } = require('discord.js');
const { checkCooldown } = require('@coreHelpers/time');
const { updatePetStatus } = require('../helpers/status');
const { toBigIntSafe } = require('@addons/economy/helpers/bigint');

module.exports = {
	subcommand: true,
	slashCommand: (subcommand) =>
		subcommand.setName('use').setDescription('Use your pet and get a bonus!'),
	async execute(interaction, container) {
		const { t, models, helpers } = container;
		const { embedFooter } = helpers.discord;
		const { KythiaUser, UserPet, Pet } = models;

		await interaction.deferReply();

		const userId = interaction.user.id;

		const kythiaUser = await KythiaUser.getCache({ userId });
		const userPet = await UserPet.findOne({
			where: { userId: userId, isDead: false },
			include: [{ model: Pet, as: 'pet' }],
		});

		if (!userPet) {
			const embed = new EmbedBuilder()
				.setDescription(
					`## ${await t(interaction, 'pet.use.no.pet.title')}\n${await t(interaction, 'pet.use.no.pet.desc')}`,
				)
				.setColor('Red')
				.setFooter(await embedFooter(interaction));
			return interaction.editReply({ embeds: [embed] });
		}

		const { pet: updatedPet, justDied } = updatePetStatus(userPet);
		await updatedPet.saveAndUpdateCache();

		if (justDied) {
			try {
				await interaction.user.send(
					'Pesan duka: Pet-mu telah mati karena tidak terurus! 💀',
				);
			} catch (_e) {
				/* abaikan jika DM gagal */
			}
			const embed = new EmbedBuilder()
				.setDescription(
					`## ${await t(interaction, 'pet.use.dead.title')}\n${await t(interaction, 'pet.use.dead.desc')}`,
				)
				.setColor('Red')
				.setFooter(await embedFooter(interaction));
			return interaction.editReply({ embeds: [embed] });
		}

		const cooldown = checkCooldown(
			updatedPet.lastUse,
			kythia.addons.pet.useCooldown || 14400,
			interaction,
		);
		if (cooldown.remaining) {
			const embed = new EmbedBuilder()
				.setDescription(
					`## ${await t(interaction, 'pet.use.cooldown.title')}\n${await t(interaction, 'pet.use.cooldown.desc', { time: cooldown.time })}`,
				)
				.setColor('Red')
				.setFooter(await embedFooter(interaction));
			return interaction.editReply({ embeds: [embed] });
		}

		updatedPet.level += 1;

		let multiplier = 1;
		if (updatedPet.level >= 30) multiplier = 5;
		else if (updatedPet.level >= 20) multiplier = 4;
		else if (updatedPet.level >= 10) multiplier = 3;
		else if (updatedPet.level >= 5) multiplier = 2;

		const bonusValue = updatedPet.pet.bonusValue * multiplier;
		let bonusTypeDisplay = '';

		if (updatedPet.pet.bonusType === 'coin') {
			kythiaUser.kythiaCoin =
				(toBigIntSafe(kythiaUser.kythiaCoin) || 0n) + toBigIntSafe(bonusValue);
			bonusTypeDisplay = 'KythiaCoin';

			kythiaUser.changed('kythiaCoin', true);
		} else if (updatedPet.pet.bonusType === 'ruby') {
			kythiaUser.kythiaRuby =
				(toBigIntSafe(kythiaUser.kythiaRuby) || 0n) + toBigIntSafe(bonusValue);
			bonusTypeDisplay = 'KythiaRuby';

			kythiaUser.changed('kythiaRuby', true);
		}

		updatedPet.lastUse = new Date();
		await updatedPet.saveAndUpdateCache();

		await kythiaUser.saveAndUpdateCache();

		const embed = new EmbedBuilder()
			.setDescription(
				`## ${await t(interaction, 'pet.use.success.title')}\n${await t(
					interaction,
					'pet.use.success.desc',
					{
						icon: updatedPet.pet.icon,
						name: updatedPet.pet.name,
						rarity: updatedPet.pet.rarity,
						bonusType: bonusTypeDisplay,
						bonusValue: bonusValue,
						level: updatedPet.level,
					},
				)}`,
			)
			.setColor(kythia.bot.color)
			.setThumbnail(interaction.user.displayAvatarURL({ dynamic: true }))
			.setFooter(await embedFooter(interaction));

		return interaction.editReply({ embeds: [embed] });
	},
};
