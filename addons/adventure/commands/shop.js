/**
 * @namespace: addons/adventure/commands/shop.js
 * @type: Command
 * @copyright © 2025 kenndeclouv
 * @assistant chaa & graa
 * @version 0.9.9-beta-rc.5
 */

const {
    SlashCommandBuilder,
    ActionRowBuilder,
    StringSelectMenuBuilder,
    ButtonBuilder,
    ButtonStyle,
    ContainerBuilder,
    TextDisplayBuilder,
    SeparatorBuilder,
    SeparatorSpacingSize,
} = require('discord.js');
const UserAdventure = require('../database/models/UserAdventure');
const { embedFooter } = require('@utils/discord');
const itemsDataFile = require('../helpers/items'); // This brings the full items.js object & methods
const { t } = require('@utils/translator');

// Use items from @items.js for shop data
const shopData = itemsDataFile.items;
const allItems = Object.values(shopData).flat();

function safeLocaleString(value, fallback = '0') {
    return typeof value === 'number' && isFinite(value) ? value.toLocaleString() : fallback;
}

async function generateShopContainer(interaction, user, category, page, pageItems, componentsBelow = []) {
    let goldDisplay = '0';
    if (user && typeof user.gold !== 'undefined' && user.gold !== null) {
        goldDisplay = safeLocaleString(user.gold, '0');
    }
    
    const headerText = await t(interaction, 'adventure.shop.desc', {
        bot: interaction.client.user.username,
        category: (await t(interaction, `adventure_shop_category_${category}`)),
        gold: goldDisplay,
    });

    let itemBlocks = [];
    if (pageItems.length === 0) {
        itemBlocks.push(
            new TextDisplayBuilder().setContent(
                `**${await t(interaction, 'adventure.shop.empty.title')}**\n${await t(interaction, 'adventure.shop.empty.desc')}`
            )
        );
    } else {
        for (const item of pageItems) {
            const itemName = await t(interaction, item.nameKey);
            const itemDesc = await t(interaction, item.descKey);
            const priceStr = safeLocaleString(item.price, '?');
            itemBlocks.push(new TextDisplayBuilder().setContent(`**${item.emoji} ${itemName} — 🪙 ${priceStr}**\n\`\`\`${itemDesc}\`\`\``));
        }
    }

    const totalPages = Math.max(
        1,
        Math.ceil(
            (category === 'all' ? allItems.filter((item) => item.buyable) : (shopData[category] || []).filter((item) => item.buyable))
                .length / 5
        )
    );
    page = Math.max(1, Math.min(page, totalPages));

    const footerText = await t(interaction, 'adventure.shop.footer', { page, totalPages });

    const container = new ContainerBuilder()
        .setAccentColor(kythia.bot?.color ? parseInt(kythia.bot.color.replace('#', ''), 16) : undefined)
        .addTextDisplayComponents(new TextDisplayBuilder().setContent(headerText))
        .addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true))
        .addTextDisplayComponents(...itemBlocks)
        .addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true))
        .addTextDisplayComponents(new TextDisplayBuilder().setContent(footerText || ''));

    if (componentsBelow && componentsBelow.length) {
        container
            .addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true))
            .addActionRowComponents(...componentsBelow);
    }

    return {
        container,
        pageItems,
        page,
        totalPages,
    };
}

async function generateShopComponentRows(interaction, page, totalPages, category, pageItems) {
    const categoryOptions = await Promise.all(
        Object.keys(shopData).map(async (cat) => ({
            label: await t(interaction, `adventure_shop_category_${cat}`),
            value: `shop_category_${cat}`,
            default: category === cat,
        }))
    );

    const rows = [];
    
    // Category selector
    const categoryRow = new ActionRowBuilder().addComponents(
        new StringSelectMenuBuilder()
            .setCustomId('adventure_shop_category')
            .setPlaceholder(await t(interaction, 'adventure.shop.select.category'))
            .addOptions(categoryOptions)
    );
    rows.push(categoryRow);

    // Navigation buttons
    const navButtons = [];
    if (page > 1) {
        navButtons.push(
            new ButtonBuilder()
                .setCustomId('adventure_shop_page_prev')
                .setLabel(await t(interaction, 'common.previous'))
                .setStyle(ButtonStyle.Secondary)
        );
    }

    if (page < totalPages) {
        navButtons.push(
            new ButtonBuilder()
                .setCustomId('adventure_shop_page_next')
                .setLabel(await t(interaction, 'common.next'))
                .setStyle(ButtonStyle.Primary)
        );
    }

    if (navButtons.length > 0) {
        rows.push(new ActionRowBuilder().addComponents(navButtons));
    }

    // Item selection
    if (pageItems.length > 0) {
        const itemOptions = await Promise.all(
            pageItems.map(async (item) => ({
                label: await t(interaction, item.nameKey),
                description: await t(interaction, 'adventure.shop.select.option.desc', { price: item.price }),
                value: item.id,
                emoji: item.emoji,
            }))
        );

        rows.push(
            new ActionRowBuilder().addComponents(
                new StringSelectMenuBuilder()
                    .setCustomId('adventure_shop_select_item')
                    .setPlaceholder(await t(interaction, 'adventure.shop.select.item.placeholder'))
                    .addOptions(itemOptions)
            )
        );
    }

    return rows;
}

function getItemsInCategory(category, page = 1, itemsPerPage = 5) {
    // Get items from the canonical items.js data
    const items = category === 'all' 
        ? allItems.filter(item => item.buyable)
        : (shopData[category] || []).filter(item => item.buyable);
    
    const startIdx = (page - 1) * itemsPerPage;
    const endIdx = startIdx + itemsPerPage;
    
    return {
        items: items.slice(startIdx, endIdx),
        totalItems: items.length,
        totalPages: Math.ceil(items.length / itemsPerPage)
    };
}

module.exports = {
    subcommand: true,
    data: (subcommand) =>
        subcommand
            .setName('shop')
            .setNameLocalizations({ id: 'toko', fr: 'boutique', ja: 'ショップ' })
            .setDescription('🛒 Buy items from the adventure shop!')
            .setDescriptionLocalizations({
                id: '🛒 Beli item petualangan di toko',
                fr: '🛒 Achète des objets d\'aventure à la boutique !',
                ja: '🛒 冒険アイテムをショップで買おう！',
            })
            .addStringOption(option =>
                option
                    .setName('category')
                    .setDescription('The category of items to show')
                    .addChoices(
                        { name: 'All', value: 'all' },
                        ...Object.keys(shopData).map(cat => ({
                            name: cat.charAt(0).toUpperCase() + cat.slice(1),
                            value: cat
                        }))
                    )
                    .setRequired(false)
            ),

    async execute(interaction) {
        await interaction.deferReply();
        const user = await UserAdventure.getCache({ userId: interaction.user.id });

        if (!user) {
            const embed = new EmbedBuilder()
                .setColor('Red')
                .setDescription(await t(interaction, 'adventure.no.character'))
                .setFooter(await embedFooter(interaction));
            return interaction.editReply({ embeds: [embed] });
        }

        const category = interaction.options.getString('category') || 'equipment';
        const { items: pageItems, totalPages } = getItemsInCategory(category, 1, 5);
        
        const { container } = await generateShopContainer(interaction, user, category, 1, pageItems);
        const components = await generateShopComponentRows(interaction, 1, totalPages, category, pageItems);
        
        const replyMessage = await interaction.editReply({
            ...container.toJSON(),
            components,
        });

        const filter = (i) => i.user.id === interaction.user.id;
        const collector = replyMessage.createMessageComponentCollector({ filter, time: 300000 });
        
        collector.on('collect', async (i) => {
            try {
                if (i.isStringSelectMenu()) {
                    if (i.customId === 'adventure_shop_category') {
                        const newCategory = i.values[0].replace('shop_category_', '');
                        const { items: newPageItems, totalPages: newTotalPages } = getItemsInCategory(newCategory, 1, 5);
                        const { container: newContainer } = await generateShopContainer(interaction, user, newCategory, 1, newPageItems);
                        const newComponents = await generateShopComponentRows(interaction, 1, newTotalPages, newCategory, newPageItems);
                        
                        await i.update({
                            ...newContainer.toJSON(),
                            components: newComponents,
                        });
                    } else if (i.customId === 'adventure_shop_select_item') {
                        const itemId = i.values[0];
                        const item = allItems.find(i => i.id === itemId);
                        
                        if (!item) {
                            await i.reply({
                                content: await t(interaction, 'adventure.shop.item.not.found'),
                                ephemeral: true,
                            });
                            return;
                        }
                        
                        if (user.gold < item.price) {
                            await i.reply({
                                content: await t(interaction, 'adventure.shop.not.enough.gold', { price: item.price, gold: user.gold }),
                                ephemeral: true,
                            });
                            return;
                        }
                        
                        // Deduct gold and add item to inventory
                        user.gold -= item.price;
                        await user.save();
                        
                        // Here you would add the item to the user's inventory
                        // await Inventory.addItem(interaction.user.id, item.id, 1);
                        
                        await i.reply({
                            content: await t(interaction, 'adventure.shop.purchase.success', { 
                                item: await t(interaction, item.nameKey),
                                price: item.price 
                            }),
                            ephemeral: true,
                        });
                        
                        // Update the shop to reflect the new gold amount
                        const currentCategory = i.message.components[0].components[0].options.find(opt => opt.default)?.value || 'equipment';
                        const { items: updatedPageItems, totalPages: updatedTotalPages } = getItemsInCategory(currentCategory, 1, 5);
                        const { container: updatedContainer } = await generateShopContainer(interaction, user, currentCategory, 1, updatedPageItems);
                        const updatedComponents = await generateShopComponentRows(interaction, 1, updatedTotalPages, currentCategory, updatedPageItems);
                        
                        await i.message.edit({
                            ...updatedContainer.toJSON(),
                            components: updatedComponents,
                        });
                    }
                } else if (i.isButton()) {
                    const currentCategory = i.message.components[0].components[0].options.find(opt => opt.default)?.value || 'equipment';
                    let currentPage = 1;
                    
                    if (i.customId === 'adventure_shop_page_prev') {
                        currentPage = parseInt(i.message.components[1].components[0].label) - 1 || 1;
                    } else if (i.customId === 'adventure_shop_page_next') {
                        currentPage = parseInt(i.message.components[1].components[1]?.label || i.message.components[1].components[0].label) + 1 || 2;
                    }
                    
                    const { items: newPageItems, totalPages: newTotalPages } = getItemsInCategory(currentCategory, currentPage, 5);
                    const { container: newContainer } = await generateShopContainer(interaction, user, currentCategory, currentPage, newPageItems);
                    const newComponents = await generateShopComponentRows(interaction, currentPage, newTotalPages, currentCategory, newPageItems);
                    
                    await i.update({
                        ...newContainer.toJSON(),
                        components: newComponents,
                    });
                }
            } catch (error) {
                console.error('Error in shop interaction:', error);
                if (!i.replied && !i.deferred) {
                    await i.reply({ content: await t(interaction, 'common.error.generic'), ephemeral: true });
                } else {
                    await i.followUp({ content: await t(interaction, 'common.error.generic'), ephemeral: true });
                }
            }
        });
        
        collector.on('end', () => {
            const disabledComponents = replyMessage.components.map(row => {
                const newRow = ActionRowBuilder.from(row);
                newRow.components = newRow.components.map(component => {
                    if (component instanceof ButtonBuilder) {
                        return ButtonBuilder.from(component).setDisabled(true);
                    } else if (component instanceof StringSelectMenuBuilder) {
                        return StringSelectMenuBuilder.from(component).setDisabled(true);
                    }
                    return component;
                });
                return newRow;
            });
            
            replyMessage.edit({ components: disabledComponents }).catch(console.error);
        });
    },
};
