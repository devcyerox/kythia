/**
 * @namespace: addons/core/helpers/reload-config.js
 * @type: Helper Script
 * @copyright © 2025 kenndeclouv
 * @assistant chaa & graa
 * @version 0.11.0-beta
 */

const dotenv = require('@dotenvx/dotenvx').config({ quiet: true });
const path = require('node:path');

const { loadKythiaConfig } = require('../../../kythia.config.js');
const logger = require('@coreHelpers/logger');

const envPath = path.resolve(process.cwd(), '.env');

/**
 * Reloads the `.env` file into `process.env` and refreshes `global.kythia`.
 */
function reloadConfig() {
	dotenv.config({ path: envPath, override: true });

	global.kythia = loadKythiaConfig();

	logger.info('✅ Configuration from .env has been reloaded and applied.');
}

module.exports = { reloadConfig };
