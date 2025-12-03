/**
 * @namespace: addons/core/helpers/index.js
 * @type: Helper Script
 * @copyright © 2025 kenndeclouv
 * @assistant chaa & graa
 * @version 0.10.0-beta
 */

const logger = require('@coreHelpers/logger');

/**
 * Clean up user cache, with translation for logs.
 * @param {Map} userCache
 * @param {object} interaction - Discord interaction/message for translation context
 */
async function cleanupUserCache(userCache) {
	if (!userCache || typeof userCache.entries !== 'function') {
		const warnMsg = '⚠️ User cache is invalid or not iterable.';
		logger.warn(warnMsg);
		return;
	}

	const now = Date.now();
	const expirationTime = 12 * 60 * 60 * 1000; // 12 hours buffer

	for (const [key, userData] of userCache.entries()) {
		if (!userData || !Array.isArray(userData.duplicateMessages)) {
			userCache.delete(key);
			continue;
		}
		const lastMessage =
			userData.duplicateMessages[userData.duplicateMessages.length - 1];

		// If user has no messages, or last message is older than 12 hours
		if (!lastMessage || now - lastMessage.createdTimestamp > expirationTime) {
			userCache.delete(key);
		}
	}
	const logMsg = '🧹 [CACHE CLEANUP] userCache cleaned';
	logger.info(logMsg);
}

module.exports = {
	cleanupUserCache,
};
