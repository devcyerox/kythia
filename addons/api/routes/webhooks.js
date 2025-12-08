/**
 * @namespace: addons/api/routes/webhooks.js
 * @type: Module
 * @copyright © 2025 kenndeclouv
 * @assistant chaa & graa
 * @version 0.10.1-beta
 */

const { Hono } = require('hono');
const { EmbedBuilder, MessageFlags } = require('discord.js');
const app = new Hono();

app.post('/topgg', async (c) => {
	const client = c.get('client');
	const container = client.container;
	const { models, logger, helpers } = container;
	const { convertColor } = helpers.color;
	const { KythiaVoter, KythiaUser } = models;
	const config = c.get('config');
	const { topgg, webhookVoteLogs } = config.api;

	if (c.req.header('Authorization') !== topgg.authToken) {
		return c.json({ error: 'Unauthorized Top.gg' }, 401);
	}

	let body;
	try {
		const rawBody = await c.req.text();

		const safeBody = rawBody.replace(/"user"\s*:\s*(\d+)/g, '"user": "$1"');
		body = JSON.parse(safeBody);
	} catch {
		return c.json({ error: 'Invalid JSON Body' }, 400);
	}
	const userId = body.user;

	if (!userId) return c.json({ error: 'No User ID' }, 400);

	try {
		const kythiaVoter = await KythiaVoter.getCache({ userId });
		if (kythiaVoter) {
			await kythiaVoter.update({ votedAt: new Date() });
		} else {
			await KythiaVoter.create({ userId, votedAt: new Date() });
		}

		let user = await KythiaUser.getCache({ userId });
		let isNew = false;

		if (!user) {
			user = await KythiaUser.create({
				userId,
				kythiaCoin: 1000,
				isVoted: true,
				voteExpiresAt: new Date(Date.now() + 12 * 60 * 60 * 1000),
				votePoints: 1,
			});
			await user.saveAndUpdateCache();
			isNew = true;
		} else {
			user.kythiaCoin = (user.kythiaCoin || 0) + 1000;
			user.isVoted = true;
			user.voteExpiresAt = new Date(Date.now() + 12 * 60 * 60 * 1000);
			user.votePoints = (user.votePoints || 0) + 1;
			await user.saveAndUpdateCache();
		}

		try {
			const discordUser = await client.users.fetch(userId);
			const embed = new EmbedBuilder()
				.setColor(config.bot.color)
				.setThumbnail(client.user.displayAvatarURL())
				.setDescription(
					isNew
						? `## 👤 Account Created!\nThanks for voting! You got **1,000 Coins**.`
						: `## 🩷 Thanks for voting!\nYou got **1,000 Coins**.`,
				);

			await discordUser.send({ embeds: [embed] });
		} catch (err) {
			logger.warn(`Failed DM to ${userId}\n${err.message}`);
		}

		const accentColor = convertColor(config.bot.color, {
			from: 'hex',
			to: 'decimal',
		});

		if (webhookVoteLogs && client) {
			try {
				const user = await client.users.fetch(userId);

				const webhookUrl = new URL(webhookVoteLogs);
				webhookUrl.searchParams.append('wait', 'true');
				webhookUrl.searchParams.append('with_components', 'true');

				const payload = {
					flags: MessageFlags.IsComponentsV2,
					components: [
						{
							type: 17,
							accent_color: accentColor,
							components: [
								{
									type: 9,
									components: [
										{
											type: 10,
											content: `## 🌸 New Vote!\n<@${userId}> (${user.username})\njust gave their love and support to **${config.bot.name}** on Top.gg!\n\nYou're very cool >,<! thank youu very muchh, Dont forget **${config.bot.name}** tomorrow!\n-# psttt look at my dm!`,
										},
									],
									accessory: {
										type: 11,
										media: {
											url: user.displayAvatarURL(),
										},
										description: `kythia's logo`,
									},
								},
								{
									type: 14,
									spacing: 1,
								},
								{
									type: 1,
									components: [
										{
											type: 2,
											style: 5,
											label: `🌸 Vote ${config.bot.name}`,
											url: `https://top.gg/bot/${config.bot.clientId}/vote`,
										},
									],
								},
								{
									type: 14,
									spacing: 1,
								},
								{
									type: 10,
									content: `-# © ${config.bot.name} by ${config.owner.names}`,
								},
							],
						},
					],
				};

				const response = await fetch(webhookUrl.href, {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(payload),
				});

				if (!response.ok) {
					const errorBody = await response.text();
					logger.warn(
						`[Webhook] Failed to send log message via fetch. Status: ${response.status}. Body: ${errorBody}`,
					);
				}
			} catch (logError) {
				logger.warn(
					`[Webhook] Vote saved, but failed to log the vote. Error: ${logError.message}`,
				);
			}
		}

		return c.json({ success: true });
	} catch (e) {
		logger.error(e);
		return c.json({ error: 'Internal Error' }, 500);
	}
});

module.exports = app;
