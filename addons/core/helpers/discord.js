/**
 * @namespace: addons/core/helpers/discord.js
 * @type: Helper Script
 * @copyright © 2025 kenndeclouv
 * @assistant chaa & graa
 * @version 0.10.1-beta
 */
const {
	ContainerBuilder,
	TextDisplayBuilder,
	SeparatorBuilder,
	SeparatorSpacingSize,
} = require('discord.js');

const axios = require('axios');

/**
 * Builds a consistent embed footer with bot username and avatar based on the context.
 * Works for `Interaction`, `Message`, and `GuildMember` sources.
 * @param {object} source - Discord.js object carrying a `client` and possibly `guild`.
 * @returns {Promise<{text:string, iconURL?:string}>}
 */
const embedFooter = async (source) => {
	const { logger, t } = source.client.container;
	// Attempt to resolve client for Interaction, Message, and GuildMember
	const client = source.client;

	// Failsafe when client is not available
	if (!client) {
		logger.warn('❌ Cant find client in embedFooter');
		return { text: 'Kythia' }; // Fallback
	}

	const botUser = client.user;

	// Choose translation context: prefer guild if available (for preferredLocale)
	const translationContext = source.guild || source;

	return {
		text: await t(translationContext, 'common.embed.footer', {
			username: botUser?.username,
		}),
		iconURL: botUser?.displayAvatarURL({ dynamic: true }),
	};
};

/**
 * Sets a custom status message on a voice channel via Discord HTTP API.
 * @param {import('discord.js').VoiceChannel|import('discord.js').BaseVoiceChannel} channel - Voice-capable channel.
 * @param {string} status - Status text to display.
 */
async function setVoiceChannelStatus(interaction, channel, status) {
	const { kythiaConfig } = interaction.client.container;
	const botToken = kythiaConfig.bot.token;
	if (!channel || !channel.isVoiceBased()) {
		return;
	}

	try {
		await axios.put(
			`https://discord.com/api/v10/channels/${channel.id}/voice-status`,
			{ status: status },
			{ headers: { Authorization: `Bot ${botToken}` } },
		);
	} catch (_e) {}
}

/**
 * Create a simple Discord container reply with optional color & auto-footer.
 * @param {object} interaction - Discord interaction (for t)
 * @param {object} container - Dependency injection
 * @param {string} content - Main response text
 * @param {object} [options={}] - Extra options
 * @param {string} [options.color] - Accent color (hex/discord)
 * @returns {Promise<object>} - Discord reply obj ({ components, flags })
 */
async function simpleContainer(interaction, content, options = {}) {
	const { kythiaConfig, helpers, t } = interaction.client.container;
	const { convertColor } = helpers.color;
	const { color } = options;

	// Get accent color
	const accentColor = color
		? convertColor(color, { from: 'discord', to: 'decimal' }) ||
			convertColor(color, { from: 'hex', to: 'decimal' })
		: convertColor(kythiaConfig.bot.color, { from: 'hex', to: 'decimal' });

	// Build container
	const replyContainer = new ContainerBuilder()
		.setAccentColor(accentColor)
		.addTextDisplayComponents(new TextDisplayBuilder().setContent(content))
		.addSeparatorComponents(
			new SeparatorBuilder()
				.setSpacing(SeparatorSpacingSize.Small)
				.setDivider(true),
		)
		.addTextDisplayComponents(
			new TextDisplayBuilder().setContent(
				await t(interaction, 'common.container.footer', {
					username: interaction.client.user.username,
				}),
			),
		);

	return [replyContainer];
}

async function getChannelSafe(guild, channelId) {
	if (!channelId) return null;
	let channel = guild.channels.cache.get(channelId);

	if (!channel) {
		try {
			channel = await guild.channels.fetch(channelId).catch(() => null);
		} catch (_e) {
			return null;
		}
	}
	return channel;
}

async function getTextChannelSafe(guild, channelId) {
	const channel = await getChannelSafe(guild, channelId);
	if (channel?.isTextBased() && channel.viewable) {
		return channel;
	}
	return null;
}

async function getMemberSafe(guild, userId) {
	if (!guild || !userId) return null;

	let member = guild.members.cache.get(userId);
	if (member) return member;

	try {
		member = await guild.members.fetch(userId).catch(() => null);
	} catch (_e) {}

	return member || null;
}

module.exports = {
	embedFooter,
	setVoiceChannelStatus,
	simpleContainer,
	getChannelSafe,
	getTextChannelSafe,
	getMemberSafe,
};
