/**
 * @namespace: addons/api/helpers/changelog.js
 * @type: Helper Script
 * @copyright © 2025 kenndeclouv
 * @assistant chaa & graa
 * @version 0.10.1-beta
 */

const { marked } = require('marked');

function parseChangelog(markdownContent) {
	const changelogs = [];

	const versions = markdownContent.split(
		/\n(?=###\s(?:\[[^\]]+\]\([^)]+\)|[\w.-]+)\s*\((\d{4}-\d{2}-\d{2})\))/,
	);

	const startIndex = versions[0].startsWith('###') ? 0 : 1;

	for (let i = startIndex; i < versions.length; i++) {
		const block = versions[i];
		if (!block.trim()) continue;

		const lines = block.split('\n');

		const headerLine = lines
			.shift()
			.replace(/^###\s*/, '')
			.trim();

		let version, date;

		let match = headerLine.match(
			/^\[([^\]]+)\]\([^)]+\)\s*\((\d{4}-\d{2}-\d{2})\)$/,
		);
		if (match) {
			version = match[1];
			date = match[2];
		} else {
			match = headerLine.match(/^([\w.-]+)\s*\((\d{4}-\d{2}-\d{2})\)$/);
			if (match) {
				version = match[1];
				date = match[2];
			}
		}

		if (version && date) {
			const contentMarkdown = lines.join('\n').trim();
			if (contentMarkdown) {
				const contentHtml = marked.parse(contentMarkdown);
				changelogs.push({
					version,
					date,
					html: contentHtml,
				});
			}
		}
	}
	return changelogs;
}

module.exports = {
	parseChangelog,
};
