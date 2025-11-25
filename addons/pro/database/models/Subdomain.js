/**
 * @namespace: addons/pro/database/models/Subdomain.js
 * @type: Database Model
 * @copyright © 2025 kenndeclouv
 * @assistant chaa & graa
 * @version 0.10.0-beta
 */

const { KythiaModel } = require('kythia-core');

class Subdomain extends KythiaModel {
	static guarded = ['id'];

	static get structure() {
		return {
			options: { timestamps: true },
		};
	}
}

module.exports = Subdomain;
