/**
 * @namespace: addons/adventure/commands/use.js
 * @type: Command
 * @copyright © 2025 kenndeclouv
 * @assistant chaa & graa
 * @version 0.10.3-beta
 */

const {
	ActionRowBuilder,
	StringSelectMenuBuilder,
	MessageFlags,
} = require('discord.js');

const { getItemById } = require('../helpers/items');

module.exports = {
	subcommand: true,
	slashCommand: (subcommand) =>
		subcommand.setName('use').setDescription('Use an item from your inventory'),

	async execute(interaction, container) {
		const { t, models, helpers, kythiaConfig } = container;
		const { UserAdventure, InventoryAdventure } = models;
		const { createContainer } = helpers.discord;

		await interaction.deferReply();
		const user = await UserAdventure.getCache({ userId: interaction.user.id });

		if (!user) {
			const msg = await t(interaction, 'adventure.no.character');
			const components = await createContainer(interaction, {
				description: msg,
				color: 'Red',
			});
			return interaction.editReply({
				components,
				flags: MessageFlags.IsComponentsV2,
			});
		}

		const rawInventory = await InventoryAdventure.findAll({
			where: { userId: interaction.user.id },
			raw: false,
		});

		const usableItemsMap = {};

		for (const dbItem of rawInventory) {
			const itemDef = getItemById(dbItem.itemName);

			if (itemDef && itemDef.type === 'consumable') {
				if (!usableItemsMap[dbItem.itemName]) {
					usableItemsMap[dbItem.itemName] = {
						count: 0,
						def: itemDef,
						dbId: dbItem.id,
					};
				}
				usableItemsMap[dbItem.itemName].count++;
			}
		}

		const usableOptions = Object.values(usableItemsMap).map(async (data) => ({
			label: `${data.def.nameKey ? await t(interaction, data.def.nameKey) : data.def.id} (x${data.count})`,
			description:
				(await t(interaction, data.def.descKey)) || 'Consumable Item',
			value: data.def.id,
			emoji: data.def.emoji,
		}));

		const resolvedOptions = await Promise.all(usableOptions);

		if (resolvedOptions.length === 0) {
			const msg = await t(interaction, 'adventure.inventory.no.usable.items');
			const components = await createContainer(interaction, {
				description: msg,
				color: 'Red',
			});
			return interaction.editReply({
				components,
				flags: MessageFlags.IsComponentsV2,
			});
		}

		const selectMenu = new ActionRowBuilder().addComponents(
			new StringSelectMenuBuilder()
				.setCustomId('use_item_select')
				.setPlaceholder(
					await t(interaction, 'adventure.inventory.select.item.placeholder'),
				)
				.addOptions(resolvedOptions),
		);

		const initialContainer = await createContainer(interaction, {
			title: await t(interaction, 'adventure.inventory.use.title'),
			description: await t(interaction, 'adventure.inventory.use.desc'),
			color: kythiaConfig.bot.color,
			components: [selectMenu],
		});

		const reply = await interaction.editReply({
			components: initialContainer,
			flags: MessageFlags.IsComponentsV2,
		});

		const filter = (i) =>
			i.customId === 'use_item_select' && i.user.id === interaction.user.id;

		try {
			const selection = await reply.awaitMessageComponent({
				filter,
				time: 60000,
			});

			const selectedItemId = selection.values[0];

			let resultMsg = '';
			let success = false;

			const targetItem = getItemById(selectedItemId);

			const freshUser = await UserAdventure.getCache({
				userId: interaction.user.id,
			});

			if (!targetItem) {
				resultMsg = await t(interaction, 'adventure.item.not.found');
			} else {
				if (targetItem.effect === 'heal') {
					if (freshUser.hp >= freshUser.maxHp) {
						resultMsg = await t(interaction, 'adventure.use.hp.full');
					} else {
						const healAmount = targetItem.amount || 0;
						const oldHp = freshUser.hp;

						freshUser.hp = Math.min(freshUser.hp + healAmount, freshUser.maxHp);
						await freshUser.saveAndUpdateCache();

						const healed = freshUser.hp - oldHp;
						const itemName = targetItem.nameKey
							? await t(interaction, targetItem.nameKey)
							: targetItem.id;

						resultMsg = await t(interaction, 'adventure.use.success.heal', {
							item: `${targetItem.emoji} ${itemName}`,
							amount: healed,
						});
						success = true;
					}
				} else if (targetItem.effect === 'revive') {
					if (freshUser.hp > 0) {
						resultMsg = await t(
							interaction,
							'adventure.use.revive.failed.alive',
						);
					} else {
						freshUser.hp = Math.floor(freshUser.maxHp * 0.5);
						await freshUser.saveAndUpdateCache();

						const itemName = targetItem.nameKey
							? await t(interaction, targetItem.nameKey)
							: targetItem.id;

						resultMsg = await t(interaction, 'adventure.use.success.revive', {
							item: `${targetItem.emoji} ${itemName}`,
						});
						success = true;
					}
				} else {
					resultMsg = await t(
						interaction,
						'adventure.inventory.cannot.use.item',
					);
				}
			}

			if (success) {
				const itemToDelete = await InventoryAdventure.findOne({
					where: {
						userId: interaction.user.id,
						itemName: selectedItemId,
					},
				});

				if (itemToDelete) {
					await itemToDelete.destroy();
					await InventoryAdventure.clearCache({ userId: interaction.user.id });
				}
			}

			const resultContainer = await createContainer(interaction, {
				title: success
					? await t(interaction, 'adventure.use.success')
					: await t(interaction, 'adventure.use.cancelled'),
				description: resultMsg,
				color: success ? 'Green' : 'Red',
			});

			await selection.update({
				components: resultContainer,
				flags: MessageFlags.IsComponentsV2,
			});
		} catch (e) {
			console.error(e);
		}
	},
};
