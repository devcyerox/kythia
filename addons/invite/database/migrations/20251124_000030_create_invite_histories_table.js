/**
 * @namespace: addons/invite/database/migrations/20251124_000030_create_invite_histories_table.js
 * @type: Database Migration
 * @copyright © 2025 kenndeclouv
 * @assistant chaa & graa
 * @version 0.10.0-beta
 */

module.exports = {
	async up(queryInterface, DataTypes) {
		await queryInterface.createTable('invite_histories', {
			id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
			guildId: { type: DataTypes.STRING, allowNull: false },
			memberId: { type: DataTypes.STRING, allowNull: false },
			inviterId: { type: DataTypes.STRING, allowNull: true },
			inviteCode: { type: DataTypes.STRING, allowNull: true },
			status: {
				type: DataTypes.ENUM('active', 'left'),
				defaultValue: 'active',
			},
			createdAt: { type: DataTypes.DATE, allowNull: false },
			updatedAt: { type: DataTypes.DATE, allowNull: false },
		});

		await queryInterface.addIndex('invite_histories', ['guildId', 'memberId']);
		await queryInterface.addIndex('invite_histories', ['guildId', 'inviterId']);
	},
	async down(queryInterface) {
		await queryInterface.dropTable('invite_histories');
	},
};
