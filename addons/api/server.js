/**
 * @namespace: addons/api/server.js
 * @type: Module
 * @copyright © 2025 kenndeclouv
 * @assistant chaa & graa
 * @version 0.10.1-beta
 */

const { Hono } = require('hono');
const { serve } = require('@hono/node-server');
const { cors } = require('hono/cors');
const { logger: honoLogger } = require('hono/logger');
const fs = require('node:fs');
const path = require('node:path');

module.exports = (bot) => {
	const client = bot.client;
	const container = client.container;
	const { logger } = container;
	const kythiaConfig = container.kythiaConfig;

	const PORT = kythiaConfig.addons.api?.port || 3000;
	const API_SECRET =
		kythiaConfig.addons.api?.secret || 'kythiaIsTheCutestBotEver';

	const app = new Hono();

	app.use('*', honoLogger());
	app.use('*', cors());

	app.use('*', async (c, next) => {
		c.set('client', client);
		c.set('container', container);
		c.set('config', kythiaConfig);
		c.set('app', app);
		await next();
	});

	app.use('/api/*', async (c, next) => {
		const url = c.req.url;

		if (url.includes('/api/webhooks')) {
			return await next();
		}

		const authHeader = c.req.header('Authorization');
		if (authHeader !== `Bearer ${API_SECRET}`) {
			return c.json({ message: 'Unauthorized: Invalid Token' }, 401);
		}
		await next();
	});

	app.get('/', (c) =>
		c.json({
			message: 'Kythia API is running! 🚀',
			runtime: typeof globalThis.Bun !== 'undefined' ? 'Bun' : 'Node.js',
		}),
	);

	const routesDir = path.join(__dirname, 'routes');

	/**
	 * Fungsi rekursif buat scan folder routes
	 * @param {string} dirPath - Path folder fisik
	 * @param {string} urlPrefix - Prefix URL (default /api)
	 */
	function loadRoutes(dirPath, urlPrefix = '/api') {
		if (!fs.existsSync(dirPath)) return;

		const files = fs.readdirSync(dirPath);

		files.forEach((file) => {
			const fullPath = path.join(dirPath, file);
			const stat = fs.statSync(fullPath);

			if (stat.isDirectory()) {
				loadRoutes(fullPath, `${urlPrefix}/${file}`);
			} else if (file.endsWith('.js') && !file.startsWith('_')) {
				const routeName = file.replace('.js', '');

				const routePath =
					routeName === 'index' ? urlPrefix : `${urlPrefix}/${routeName}`;

				try {
					const routeModule = require(fullPath);

					app.route(routePath, routeModule);
					logger.info(`   └─ 🛤️  Route loaded: ${routePath} -> ${file}`);
				} catch (err) {
					logger.error(`   └─ ❌ Error loading route ${file}:`, err.message);
				}
			}
		});
	}

	logger.info('🔄 Loading API Routes...');
	loadRoutes(routesDir);

	logger.info(`🔥 API Server running on port ${PORT}`);

	const server = serve({
		fetch: app.fetch,
		port: Number(PORT),
	});

	return server;
};
