/**
 * @namespace: addons/core/events/guildRoleUpdate.js
 * @type: Event Handler
 * @copyright © 2025 kenndeclouv
 * @assistant chaa & graa
 * @version 0.9.9-beta-rc.4
 */

const ServerSetting = require('../database/models/ServerSetting');
const { rolePrefix } = require('../helpers');

module.exports = async (bot, guild) => {
    const guildId = guild.id;

    // Get server settings
    const setting = await ServerSetting.getCache({ guildId: guildId });

    if (setting.rolePrefixOn) {
        await rolePrefix(newMember.guild);
    }
};
