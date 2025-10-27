/**
 * @namespace: addons/core/events/messageUpdate.js
 * @type: Event Handler
 * @copyright © 2025 kenndeclouv
 * @assistant chaa & graa
 * @version 0.9.10-beta
 */

const { isOwner } = require('@coreHelpers/discord');
const { automodSystem } = require('../helpers/automod');

module.exports = async (bot, message) => {
    try {
        const client = bot.client;
        if (!message || !message.author || !message.guild) return;
        if (message.author.bot) return;

        if (isOwner(message.author.id)) {
            try {
                const isFlagged = await automodSystem(message, client);
                if (isFlagged) return true;
            } catch (err) {
                console.error('Error in automodSystem (messageUpdate):', err);
            }
        }
    } catch (err) {
        console.error('Error in messageUpdate event handler:', err);
    }
};
