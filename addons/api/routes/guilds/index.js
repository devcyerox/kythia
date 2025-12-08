/**
 * @namespace: addons/api/routes/guilds/index.js
 * @type: Module
 * @copyright © 2025 kenndeclouv
 * @assistant chaa & graa
 * @version 0.10.1-beta
 */

const { Hono } = require('hono');
const app = new Hono();

app.get('/', (c) => {
	const client = c.get('client');

	const guilds = client.guilds.cache.map((g) => ({
		id: g.id,
		name: g.name,
		icon: g.iconURL(),
		memberCount: g.memberCount,
		ownerId: g.ownerId,
	}));

	return c.json(guilds);
});

module.exports = app;
