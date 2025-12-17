/**
 * @namespace: addons/api/routes/list.js
 * @type: Module
 * @copyright © 2025 kenndeclouv
 * @assistant chaa & graa
 * @version 0.11.0-beta
 */

const { Hono } = require('hono');
const app = new Hono();

app.get('/', (c) => {
	const mainApp = c.get('app');
	const routes = [];

	mainApp.routes.forEach((route) => {
		if (route.method !== 'ALL') {
			routes.push({
				method: route.method,
				path: route.path,
			});
		}
	});

	routes.sort((a, b) => a.path.localeCompare(b.path));

	return c.json({
		success: true,
		count: routes.length,
		routes: routes,
	});
});

module.exports = app;
