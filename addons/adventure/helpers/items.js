/**
 * @namespace: addons/adventure/helpers/items.js
 * @type: Helper Script
 * @copyright © 2025 kenndeclouv
 * @assistant chaa & graa
 * @version 0.9.9-beta-rc.4
 */

const items = {
    equipment: [
        {
            id: 'shield',
            emoji: '🛡️',
            nameKey: 'adventure_shop_items_shield_name',
            descKey: 'adventure_shop_items_shield_desc',
            price: 10,
            buyable: true,
            sellPrice: 5,
            type: 'equipment',
            stats: {
                defense: 5,
            },
        },
        {
            id: 'sword',
            emoji: '⚔️',
            nameKey: 'adventure_shop_items_sword_name',
            descKey: 'adventure_shop_items_sword_desc',
            price: 15,
            buyable: true,
            sellPrice: 8,
            type: 'equipment',
            stats: {
                attack: 7,
            },
        },
        {
            id: 'armor',
            emoji: '🥋',
            nameKey: 'adventure_shop_items_armor_name',
            descKey: 'adventure_shop_items_armor_desc',
            price: 30,
            buyable: true,
            sellPrice: 15,
            type: 'equipment',
            stats: {
                defense: 10,
                health: 20,
            },
        },
    ],
    consumables: [
        {
            id: 'revival',
            emoji: '🍶',
            nameKey: 'adventure_shop_items_revival_name',
            descKey: 'adventure_shop_items_revival_desc',
            price: 35,
            buyable: true,
            sellPrice: 15,
            type: 'consumable',
            effect: 'revive',
            uses: 1,
        },
        {
            id: 'health_potion',
            emoji: '❤️',
            nameKey: 'adventure_shop_items_health_potion_name',
            descKey: 'adventure_shop_items_health_potion_desc',
            price: 20,
            buyable: true,
            sellPrice: 8,
            type: 'consumable',
            effect: 'heal',
            amount: 50,
            uses: 1,
        },
    ],
};
/**
 * Retrieves the item definition object from its display name (as stored in inventory).
 * Supports both equipment and consumables.
 * @param {string} itemName - The display name of the item (may include emoji).
 * @returns {object|null} Item object if found, else null.
 */
function getItem(itemName) {
    const categories = ['equipment', 'consumables'];
    for (const cat of categories) {
        for (const item of items[cat]) {
            // Try to match with both [emoji + space + localized name] and simple localized name
            // For now, match on emoji for inventory since that's stored
            const localizedName = item.emoji + ' ' + getLocalizedItemName(item);
            if (itemName === localizedName || itemName === getLocalizedItemName(item)) {
                // Enhance with resolved description
                return {
                    ...item,
                    name: localizedName,
                    description: getLocalizedItemDesc(item),
                };
            }
        }
    }
    return null;
}

/**
 * Helper to get the localized item name.
 * Replace this with translation lookup as needed.
 */
function getLocalizedItemName(item) {
    // This is a stub. If using i18n, replace with translation util.
    // For now just use id/title case as fallback
    if (item.nameKey) {
        // Assume no i18n, fallback to id
        return item.emoji + ' ' + item.id.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase());
    }
    return item.emoji + ' ' + item.id;
}

/**
 * Helper to get the localized item description.
 * Replace this with translation lookup as needed.
 */
function getLocalizedItemDesc(item) {
    // This is a stub. If using i18n, replace with translation util.
    if (item.descKey) {
        return 'No description.';
    }
    return '';
}

module.exports = {
    items,
    getItem,
};
