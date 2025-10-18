/**
 * @namespace: addons/music/register.js
 * @type: Module
 * @copyright © 2025 kenndeclouv
 * @assistant chaa & graa
 * @version 0.9.9-beta-rc.4
 */

const initializeMusicManager = require('./helpers/musicManager');

module.exports = {
    async initialize(bot) {
        const summary = [];
        await initializeMusicManager(bot);
        summary.push('   └─ 🎵 Initialize Music Manager');
        
        bot.addDbReadyHook((sequelize) => {
            const { Playlist, PlaylistTrack } = sequelize.models;

            if (Playlist && PlaylistTrack) {
                Playlist.hasMany(PlaylistTrack, { foreignKey: 'playlistId', as: 'tracks' });
                PlaylistTrack.belongsTo(Playlist, { foreignKey: 'playlistId', as: 'playlist' });
            }
        });
        summary.push('   └─ 🎵 Model associations registered.');
        return summary;
    },
};
