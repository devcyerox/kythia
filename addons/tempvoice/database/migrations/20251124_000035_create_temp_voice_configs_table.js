/**
 * @namespace: addons/tempvoice/database/migrations/20251124_000035_create_temp_voice_configs_table.js
 * @type: Database Migration
 * @copyright © 2025 kenndeclouv
 * @assistant chaa & graa
 * @version 0.11.0-beta
 */

module.exports = {
	async up(queryInterface, DataTypes) {
		await queryInterface.createTable('temp_voice_configs', {
			guildId: {
				type: DataTypes.STRING,
				primaryKey: true,
				allowNull: false,
			},
			triggerChannelId: { type: DataTypes.STRING, allowNull: false },
			controlPanelChannelId: { type: DataTypes.STRING, allowNull: true },
			interfaceMessageId: { type: DataTypes.STRING, allowNull: true },
			categoryId: { type: DataTypes.STRING, allowNull: false },
			createdAt: { type: DataTypes.DATE, allowNull: false },
			updatedAt: { type: DataTypes.DATE, allowNull: false },
		});
	},
	async down(queryInterface) {
		await queryInterface.dropTable('temp_voice_configs');
	},
};
