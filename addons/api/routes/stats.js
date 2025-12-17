/**
 * @namespace: addons/api/routes/stats.js
 * @type: Module
 * @copyright © 2025 kenndeclouv
 * @assistant chaa & graa
 * @version 0.11.0-beta
 */

const { Hono } = require('hono');
const app = new Hono();

app.get('/', (c) => {
	const client = c.get('client');
	return c.json({
		ping: client.ws.ping,
		uptime: client.uptime,
		guilds: client.guilds.cache.size,
		users: client.users.cache.size,
		ram_usage: `${(process.memoryUsage().rss / 1024 / 1024).toFixed(2)} MB`,
	});
});

module.exports = app;
