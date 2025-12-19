/**
 * @namespace: addons/core/helpers/events.js
 * @type: Helper Script
 * @copyright © 2025 kenndeclouv
 * @assistant chaa & graa
 * @version 0.11.0-beta
 */

/**
 * Creates mock event arguments for testing with client.emit().
 * @param {string} eventName - The name of the event to mock.
 * @param {import('discord.js').Interaction} interaction - The interaction to source base data from.
 * @param {string} type - The specific scenario type (e.g., 'boost', 'unboost', 'default').
 * @returns {Promise<Array<any>>} An array of arguments for the event.
 */
async function createMockEventArgs(eventName, interaction, type = 'default') {
	const { member, guild, channel, user, client } = interaction;

	switch (eventName) {
		case 'messageCreate':
		case 'messageDelete':
			return [
				await channel.send({ content: 'This is a dummy message for testing.' }),
			];

		case 'messageUpdate': {
			const oldMessage = {
				...(await channel.send({ content: 'Old message content.' })),
				content: 'Old message content.',
			};
			const newMessage = await channel.messages.fetch(oldMessage.id);
			newMessage.content = 'This is the new, updated message content.';
			return [oldMessage, newMessage];
		}

		case 'guildMemberAdd':
		case 'guildMemberRemove':
			return [member];

		case 'guildMemberUpdate': {
			const oldMember = Object.assign(
				Object.create(Object.getPrototypeOf(member)),
				member,
			);
			const newMember = member;

			switch (type) {
				case 'boost':
					oldMember.premiumSinceTimestamp = null;
					Object.defineProperty(oldMember, 'premiumSince', {
						get: () => null,
						configurable: true,
					});

					if (!newMember.premiumSinceTimestamp) {
						newMember.premiumSinceTimestamp = Date.now();
						Object.defineProperty(newMember, 'premiumSince', {
							get: () => new Date(newMember.premiumSinceTimestamp),
							configurable: true,
						});
					}
					return [oldMember, newMember];

				case 'unboost':
					oldMember.premiumSinceTimestamp =
						Date.now() - 1000 * 60 * 60 * 24 * 7;
					Object.defineProperty(oldMember, 'premiumSince', {
						get: () => new Date(oldMember.premiumSinceTimestamp),
						configurable: true,
					});

					newMember.premiumSinceTimestamp = null;
					Object.defineProperty(newMember, 'premiumSince', {
						get: () => null,
						configurable: true,
					});
					return [oldMember, newMember];
				default:
					oldMember.nickname = oldMember.nickname ? null : 'OldNickname_123';
					return [oldMember, newMember];
			}
		}

		case 'guildCreate':
		case 'guildDelete':
			return [guild];

		case 'guildUpdate': {
			const oldGuild = Object.assign(
				Object.create(Object.getPrototypeOf(guild)),
				guild,
			);
			oldGuild.name = 'Old Server Name';
			return [oldGuild, guild];
		}

		case 'guildBanAdd':
		case 'guildBanRemove':
			return [{ guild, user, reason: 'Test ban from /testevent' }];

		case 'channelCreate':
		case 'channelDelete':
			return [channel];

		case 'roleCreate':
		case 'roleDelete':
			return [guild.roles.cache.first() || { name: 'fake-role', id: '12345' }];

		case 'voiceStateUpdate': {
			const oldState = { ...member.voice, channel: null, channelId: null };
			const newState = member.voice;
			return [oldState, newState];
		}

		case 'ready':
			return [client];

		case 'interactionCreate':
			return [interaction];

		default:
			throw new Error(
				`Event '${eventName}' is not supported by the mock event generator.`,
			);
	}
}

module.exports = { createMockEventArgs };
