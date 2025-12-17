/**
 * @namespace: addons/api/routes/meta.js
 * @type: Module
 * @copyright © 2025 kenndeclouv
 * @assistant chaa & graa
 * @version 0.11.0-beta
 */

const { Hono } = require('hono');
const path = require('node:path');
const fs = require('node:fs');
const { getCommandsData } = require('../helpers/commands');
const { parseChangelog } = require('../helpers/changelog');

const app = new Hono();

app.get('/stats', (c) => {
	const client = c.get('client');
	const totalServers = client.guilds.cache.size;
	const totalMembers = client.guilds.cache.reduce(
		(acc, guild) => acc + (guild.memberCount || 0),
		0,
	);

	return c.json({
		totalServers,
		totalMembers,
		uptime: client.uptime,
		ping: client.ws.ping,
	});
});

app.get('/commands', async (c) => {
	const client = c.get('client');
	try {
		const { commands, categories, totalCommands } =
			await getCommandsData(client);
		return c.json({ commands, categories, totalCommands });
	} catch (error) {
		return c.json({ error: `Failed to fetch commands: ${error}` }, 500);
	}
});

app.get('/changelog', (c) => {
	try {
		const changelogPath = path.join(process.cwd(), 'changelog.md');
		const changelogMd = fs.readFileSync(changelogPath, 'utf-8');
		const parsed = parseChangelog(changelogMd);
		return c.json(parsed);
	} catch (error) {
		return c.json({ error: `Changelog not found: ${error}` }, 404);
	}
});

module.exports = app;
