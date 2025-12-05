/**
 * @namespace: addons/pro/database/migrations/20251124_000033_create_dns_records_table.js
 * @type: Database Migration
 * @copyright © 2025 kenndeclouv
 * @assistant chaa & graa
 * @version 0.10.1-beta
 */

module.exports = {
	async up(queryInterface, DataTypes) {
		await queryInterface.createTable('dns_records', {
			id: {
				type: DataTypes.INTEGER,
				autoIncrement: true,
				primaryKey: true,
			},
			subdomainId: {
				type: DataTypes.INTEGER,
				allowNull: false,
				references: { model: 'subdomains', key: 'id' },
				onDelete: 'CASCADE',
			},
			type: {
				type: DataTypes.ENUM('A', 'CNAME', 'TXT', 'MX'),
				allowNull: false,
			},
			name: { type: DataTypes.STRING, allowNull: false },
			value: { type: DataTypes.TEXT, allowNull: false },
			cloudflareId: { type: DataTypes.STRING, allowNull: true },
		});
	},
	async down(queryInterface) {
		await queryInterface.dropTable('dns_records');
	},
};
