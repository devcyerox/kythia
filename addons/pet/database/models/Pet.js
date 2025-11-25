/**
 * @namespace: addons/pet/database/models/Pet.js
 * @type: Database Model
 * @copyright © 2025 kenndeclouv
 * @assistant chaa & graa
 * @version 0.10.0-beta
 */

const { KythiaModel } = require('kythia-core');

class Pet extends KythiaModel {
	static guarded = [];

	static get structure() {
		return {
			options: { timestamps: false },
		};
	}
}

module.exports = Pet;
