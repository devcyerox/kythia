/**
 * @namespace: addons/api/routes/guilds/index.js
 * @type: Module
 * @copyright © 2025 kenndeclouv
 * @assistant chaa & graa
 * @version 0.11.0-beta
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

app.get('/:id', async (c) => {
	const client = c.get('client');
	const container = client.container;
	const { models } = container;
	const { ServerSetting } = models;
	const guildId = c.req.param('id');
	const dataParam = c.req.query('data');

	const guild = client.guilds.cache.get(guildId);

	if (!guild) {
		return c.json({ error: 'Bot is not in this guild' }, 404);
	}

	let settings = await ServerSetting.getCache({ where: { guildId } });

	if (!settings) settings = {};

	const channels = {
		text: guild.channels.cache
			.filter((c) => c.type === 0)
			.map((c) => ({ id: c.id, name: c.name })),
		voice: guild.channels.cache
			.filter((c) => c.type === 2)
			.map((c) => ({ id: c.id, name: c.name })),
		categories: guild.channels.cache
			.filter((c) => c.type === 4)
			.map((c) => ({ id: c.id, name: c.name })),
	};

	const roles = guild.roles.cache.map((r) => ({
		id: r.id,
		name: r.name,
		color: r.hexColor,
		managed: r.managed,
	}));

	const responseGuild =
		dataParam === 'all'
			? guild
			: { id: guild.id, name: guild.name, icon: guild.iconURL() };

	return c.json({
		guild: responseGuild,
		settings,
		channels,
		roles,

		botUser: {
			username: client.user.username,
			avatar: client.user.displayAvatarURL(),
			id: client.user.id,
			discriminator: client.user.discriminator,
		},
	});
});

module.exports = app;
