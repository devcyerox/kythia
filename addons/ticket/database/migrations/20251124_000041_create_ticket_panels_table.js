/**
 * @namespace: addons/ticket/database/migrations/20251124_000041_create_ticket_panels_table.js
 * @type: Database Migration
 * @copyright © 2025 kenndeclouv
 * @assistant chaa & graa
 * @version 0.11.0-beta
 */

module.exports = {
	async up(queryInterface, DataTypes) {
		await queryInterface.createTable('ticket_panels', {
			id: {
				type: DataTypes.INTEGER,
				autoIncrement: true,
				primaryKey: true,
			},
			guildId: { type: DataTypes.STRING, allowNull: false },
			channelId: { type: DataTypes.STRING, allowNull: false },
			messageId: { type: DataTypes.STRING, allowNull: false, unique: true },
			title: { type: DataTypes.STRING, allowNull: false },
			description: { type: DataTypes.TEXT, allowNull: true },
			image: { type: DataTypes.STRING, allowNull: true },
			createdAt: { type: DataTypes.DATE, allowNull: false },
			updatedAt: { type: DataTypes.DATE, allowNull: false },
		});
	},
	async down(queryInterface) {
		await queryInterface.dropTable('ticket_panels');
	},
};
