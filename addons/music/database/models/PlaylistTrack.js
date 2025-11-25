/**
 * @namespace: addons/music/database/models/PlaylistTrack.js
 * @type: Database Model
 * @copyright © 2025 kenndeclouv
 * @assistant chaa & graa
 * @version 0.10.0-beta
 */

const { KythiaModel } = require('kythia-core');

class PlaylistTrack extends KythiaModel {
	static guarded = [];

	static get structure() {
		return {
			options: { timestamps: false },
		};
	}

	static associate(models) {
		this.belongsTo(models.Playlist, {
			foreignKey: 'playlistId',
			as: 'playlist',
		});

		this.setupParentTouch('playlistId', models.Playlist, 'updatedAt');
	}
}

module.exports = PlaylistTrack;
