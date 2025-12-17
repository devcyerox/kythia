/**
 * @namespace: addons/api/routes/guilds/branding.js
 * @type: Module
 * @copyright © 2025 kenndeclouv
 * @assistant chaa & graa
 * @version 0.11.0-beta
 */

const { Hono } = require('hono');
const app = new Hono();

app.patch('/:guildId', async (c) => {
	const client = c.get('client');
	const container = client.container;
	const { models, logger } = container;
	const { ServerSetting } = models;
	const guildId = c.req.param('guildId');
	const body = await c.req.json();

	const guild = client.guilds.cache.get(guildId);
	if (!guild) return c.json({ error: 'Guild not found' }, 404);

	try {
		const me = guild.members.me;

		const updatePayload = {};

		if (body.nickname !== undefined) {
			updatePayload.nick = body.nickname || null;
		}

		if (body.avatar !== undefined) {
			updatePayload.avatar = body.avatar || null;
		}

		if (Object.keys(updatePayload).length > 0) {
			await me.edit(updatePayload);
		}

		let settings = await ServerSetting.getCache({ where: { guildId } });
		if (!settings) {
			settings = await ServerSetting.create({
				guildId: guildId,
				guildName: guild.name,
			});
		}

		await settings.update({
			botName: body.nickname,
			botAvatarUrl: body.avatar,
			botBannerUrl: body.banner,
			botBio: body.bio,
		});

		return c.json({ success: true });
	} catch (e) {
		logger.error(e);

		if (e.code === 50013) {
			return c.json(
				{ error: 'Bot Missing Permissions: Cannot change nickname/avatar.' },
				403,
			);
		}

		return c.json(
			{ error: 'Failed to update bot profile.', details: e.message },
			500,
		);
	}
});

module.exports = app;
