/**
 * @namespace: addons/music/database/models/Playlist.js
 * @type: Database Model
 * @copyright © 2025 kenndeclouv
 * @assistant chaa & graa
 * @version 0.10.0-beta
 */

const { KythiaModel } = require('kythia-core');

class Playlist extends KythiaModel {
	static guarded = [];

	static get structure() {
		return {
			options: { timestamps: true },
		};
	}

	static associate(models) {
		this.hasMany(models.PlaylistTrack, {
			foreignKey: 'playlistId',
			as: 'tracks',
		});
	}
}

module.exports = Playlist;
