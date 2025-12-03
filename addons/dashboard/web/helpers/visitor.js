/**
 * @namespace: addons/dashboard/web/helpers/visitor.js
 * @type: Helper Script
 * @copyright © 2025 kenndeclouv
 * @assistant chaa & graa
 * @version 0.10.0-beta
 */

const Visitor = require('@addons/dashboard/database/models/Visitor');
const crypto = require('node:crypto');

function getTodayString() {
	return new Date().toISOString().slice(0, 10);
}

/**
 * Middleware to fetch visitor data and provide it to all EJS files via `res.locals`.
 */
const loadVisitorCounts = async (_req, res, next) => {
	try {
		const todayStr = getTodayString();

		const [todayCount, totalCount] = await Promise.all([
			Visitor.count({
				where: { visitDate: todayStr },
				// customCacheKey: `Visitor:Count:Date:${todayStr}`
			}),

			Visitor.count({
				// customCacheKey: `Visitor:Count:Total`
			}),
		]);

		res.locals.todayVisitors = typeof todayCount === 'number' ? todayCount : 0;
		res.locals.totalVisitors = typeof totalCount === 'number' ? totalCount : 0;
	} catch (error) {
		console.error('Failed to load visitor data:', error);
		res.locals.todayVisitors = 0;
		res.locals.totalVisitors = 0;
	}
	next();
};

/**
 * Middleware to track unique visitors per day.
 */
const trackVisitor = async (req, _res, next) => {
	try {
		const ip =
			req.headers['x-forwarded-for']?.split(',').shift() ||
			req.socket.remoteAddress;

		if (!ip) return next();

		const ipHash = crypto.createHash('sha256').update(ip).digest('hex');

		const todayStr = getTodayString();

		const [_visitor, created] = await Visitor.findOrCreate({
			where: {
				ipHash: ipHash,
				visitDate: todayStr,
			},
			defaults: {
				ipHash: ipHash,
				visitDate: todayStr,
			},
		});

		if (created) {
			// await Visitor.clearCache(`Visitor:Count:Date:${todayStr}`);
			// await Visitor.clearCache(`Visitor:Count:Total`);
			// await Visitor.clearCache({
			//     queryType: 'count',
			//     where: { visitDate: todayStr },
			// });
			// console.log(
			// 	`✅ New unique visitor detected today (${todayStr}). Caches cleared.`,
			// );
		}
	} catch (error) {
		console.error('Failed to track visitor (Silent):', error.message);
	}

	next();
};

module.exports = { loadVisitorCounts, trackVisitor };
