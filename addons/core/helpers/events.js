/**
 * @namespace: addons/core/helpers/events.js
 * @type: Helper Script
 * @copyright © 2025 kenndeclouv
 * @assistant chaa & graa
 * @version 0.11.0-beta
 */

/**
 * Membuat objek interaction palsu dari sebuah Message.
 * VERSI PALING SEMPURNA: State management reply/defer/followUp/edit/delete, argumen, dan error handling sangat teliti.
 * @param {import('discord.js').Message} message - Objek pesan asli.
 * @param {string} commandName - Nama command yang dijalankan.
 * @param {string[]|object} args - Argumen, bisa array (prefix) atau objek (AI).
 * @returns {object} Objek interaction palsu yang sangat kompatibel.
 */

function kythiaInteraction(message, commandName, rawArgsString) {
	let replied = false,
		deferred = false,
		replyMessage = null,
		deleted = false;
	let followUpMessages = [];
	let argsObject = {},
		subcommand = null,
		subcommandGroup = null;

	const commandDef = message.client?.commands?.get(commandName);
	const potentialArgs =
		typeof rawArgsString === 'string' ? rawArgsString.split(/ +/) : [];
	const plainTextArgs = [];

	for (const arg of potentialArgs) {
		if (arg.includes(':')) {
			const [key, ...valueParts] = arg.split(':');
			argsObject[key.toLowerCase()] = valueParts.join(':').trim();
		} else if (arg.trim() !== '') {
			plainTextArgs.push(arg);
		}
	}

	if (plainTextArgs.length > 0) {
		const firstArg = plainTextArgs[0].toLowerCase();

		if (plainTextArgs.length >= 2) {
			const testKey = `${commandName} ${firstArg} ${plainTextArgs[1].toLowerCase()}`;
			if (message.client.commands.has(testKey)) {
				subcommandGroup = plainTextArgs.shift().toLowerCase();
				subcommand = plainTextArgs.shift().toLowerCase();
			}
		}

		if (!subcommand && plainTextArgs.length >= 1) {
			const testKey = `${commandName} ${firstArg}`;
			if (message.client.commands.has(testKey)) {
				subcommand = plainTextArgs.shift().toLowerCase();
			}
		}

		if (!subcommand && plainTextArgs.length >= 1) {
			subcommand = plainTextArgs.shift().toLowerCase();
		}
	}

	const remainingPlainText = plainTextArgs.join(' ');

	const finalCommandKeyForDefaultArg =
		`${commandName} ${subcommandGroup || ''} ${subcommand || ''}`
			.replace(/ +/g, ' ')
			.trim();
	const commandForDefaultArg =
		message.client?.commands?.get(finalCommandKeyForDefaultArg) || commandDef;

	if (commandForDefaultArg?.defaultArgument && remainingPlainText) {
		argsObject[commandForDefaultArg.defaultArgument] = remainingPlainText;
	}

	function normalizeReplyOptions(options) {
		if (typeof options === 'string') return { content: options };
		if (typeof options === 'object' && options !== null) return { ...options };
		return { content: '' };
	}

	async function safeDelete(msg) {
		if (!msg) return;
		try {
			if (!msg.deleted) await msg.delete();
		} catch (_e) {}
	}

	async function safeSend(channel, options) {
		try {
			if (!channel || typeof channel.send !== 'function')
				throw new Error('Invalid channel');
			return await channel.send(options);
		} catch (_e) {
			try {
				if (message.author && typeof message.author.send === 'function') {
					return await message.author.send(options);
				}
			} catch (_e2) {
				return null;
			}
		}
	}

	function resolveUser(val) {
		try {
			if (!val) return message.mentions?.users?.first?.() || null;
			const userId = String(val).replace(/[<@!>]/g, '');
			return (
				message.client.users.cache.get(userId) ||
				message.mentions?.users?.get?.(userId) ||
				null
			);
		} catch (_e) {
			return null;
		}
	}
	function resolveMember(val) {
		try {
			const user = resolveUser(val);
			return user ? message.guild?.members?.resolve(user) : null;
		} catch (_e) {
			return null;
		}
	}
	function resolveChannel(val) {
		try {
			if (!val) return message.mentions?.channels?.first?.() || null;
			const channelId = String(val).replace(/[<#>]/g, '');
			return (
				message.client.channels.cache.get(channelId) ||
				message.mentions?.channels?.get?.(channelId) ||
				null
			);
		} catch (_e) {
			return null;
		}
	}
	function resolveRole(val) {
		try {
			if (!val || !message.guild)
				return message.mentions?.roles?.first?.() || null;
			const roleId = String(val).replace(/[<@&>]/g, '');
			return (
				message.guild.roles.cache.get(roleId) ||
				message.mentions?.roles?.get?.(roleId) ||
				null
			);
		} catch (_e) {
			return null;
		}
	}

	const fakeInteraction = {
		commandName: commandName,
		user: message.author,
		member: message.member,
		guild: message.guild,
		channel: message.channel,
		client: message.client,
		isFake: true,
		createdTimestamp: message.createdTimestamp,
		id: message.id,
		applicationId: message.client?.application?.id || null,
		type: 2,
		locale: message.locale || 'id',

		get replied() {
			return replied;
		},
		get deferred() {
			return deferred;
		},
		get deleted() {
			return deleted;
		},

		set replied(val) {
			replied = !!val;
		},
		set deferred(val) {
			deferred = !!val;
		},
		set deleted(val) {
			deleted = !!val;
		},

		deferReply: async (options = {}) => {
			if (deleted)
				throw new Error('Interaction already deleted, cannot deferReply.');
			if (replied) {
				throw new Error(
					'Interaction already replied, cannot deferReply again.',
				);
			}
			if (deferred) {
				return replyMessage;
			}
			deferred = true;
			fakeInteraction.deferred = true;
			try {
				replyMessage = await safeSend(message.channel, {
					content: '⏳ ...',
					...options,
				});
			} catch (_e) {
				replyMessage = null;
			}
			return replyMessage;
		},

		reply: async (options) => {
			if (deleted)
				throw new Error('Interaction already deleted, cannot reply.');
			options = normalizeReplyOptions(options);
			if (deferred) {
				return fakeInteraction.editReply(options);
			}
			if (replied) {
				return fakeInteraction.followUp(options);
			}
			replied = true;
			fakeInteraction.replied = true;
			try {
				replyMessage = await safeSend(message.channel, options);
			} catch (_e) {
				replyMessage = null;
			}
			return replyMessage;
		},

		editReply: async (options) => {
			if (deleted)
				throw new Error('Interaction already deleted, cannot editReply.');
			options = normalizeReplyOptions(options);
			if (!replyMessage) {
				return fakeInteraction.reply(options);
			}
			if (
				replyMessage.content &&
				replyMessage.content.trim() === '⏳ ...' &&
				(!options ||
					(typeof options === 'object' && options.content !== '⏳ ...'))
			) {
				await safeDelete(replyMessage);
				try {
					replyMessage = await safeSend(message.channel, options);
				} catch (_e) {
					replyMessage = null;
				}
				replied = true;
				deferred = false;
				fakeInteraction.replied = true;
				fakeInteraction.deferred = false;
				return replyMessage;
			}

			try {
				if (typeof replyMessage.edit === 'function') {
					const editedMessage = await replyMessage.edit(options);
					replied = true;
					deferred = false;
					fakeInteraction.replied = true;
					fakeInteraction.deferred = false;
					return editedMessage;
				} else {
					replyMessage = await safeSend(message.channel, options);
					replied = true;
					deferred = false;
					fakeInteraction.replied = true;
					fakeInteraction.deferred = false;
					return replyMessage;
				}
			} catch (_e) {
				try {
					replyMessage = await safeSend(message.channel, options);
				} catch (_e2) {
					replyMessage = null;
				}
				replied = true;
				deferred = false;
				fakeInteraction.replied = true;
				fakeInteraction.deferred = false;
				return replyMessage;
			}
		},

		followUp: async (options) => {
			if (deleted)
				throw new Error('Interaction already deleted, cannot followUp.');
			if (!replied && !deferred)
				throw new Error('Cannot followUp before reply/defer.');
			options = normalizeReplyOptions(options);
			let msg = null;
			try {
				msg = await safeSend(message.channel, options);
			} catch (_e) {
				msg = null;
			}
			if (msg) followUpMessages.push(msg);
			return msg;
		},

		deleteReply: async () => {
			if (deleted) return;
			try {
				await safeDelete(replyMessage);
			} catch (_e) {}
			for (const msg of followUpMessages) {
				try {
					await safeDelete(msg);
				} catch (_e) {}
			}
			replyMessage = null;
			followUpMessages = [];
			replied = false;
			deferred = false;
			deleted = true;
		},

		fetchReply: () => {
			if (replyMessage && !replyMessage.deleted) return replyMessage;
			return null;
		},

		options: {
			_getArg: (name) => {
				try {
					if (!name) return null;
					const key = String(name).toLowerCase();
					if (argsObject[key] !== undefined) return argsObject[key];

					for (const k of Object.keys(argsObject)) {
						if (k.replace(/[-_ ]/g, '') === key.replace(/[-_ ]/g, ''))
							return argsObject[k];
					}
					return null;
				} catch (_e) {
					return null;
				}
			},
			getSubcommand: () => subcommand || null,
			getSubcommandGroup: () => subcommandGroup || null,
			getString: (name) => {
				try {
					const val = fakeInteraction.options._getArg(name);
					if (val === null || val === undefined) return null;
					if (typeof val === 'string') return val;
					if (typeof val === 'number' || typeof val === 'boolean')
						return String(val);
					return null;
				} catch (_e) {
					return null;
				}
			},
			getInteger: (name) => {
				try {
					const val = fakeInteraction.options._getArg(name);
					if (val === null || val === undefined) return null;
					const n = parseInt(val, 10);
					return !Number.isNaN(n) ? n : null;
				} catch (_e) {
					return null;
				}
			},
			getBoolean: (name) => {
				try {
					const val = fakeInteraction.options._getArg(name);
					if (val === null || val === undefined) return null;
					if (typeof val === 'boolean') return val;
					if (typeof val === 'number') return val !== 0;
					if (typeof val === 'string') {
						const s = val.trim().toLowerCase();
						if (['true', 'yes', '1', 'y', 'on'].includes(s)) return true;
						if (['false', 'no', '0', 'n', 'off'].includes(s)) return false;
					}
					return null;
				} catch (_e) {
					return null;
				}
			},
			getNumber: (name) => {
				try {
					const val = fakeInteraction.options._getArg(name);
					if (val === null || val === undefined) return null;
					const n = parseFloat(val);
					return !Number.isNaN(n) ? n : null;
				} catch (_e) {
					return null;
				}
			},
			getUser: (name) => {
				try {
					const val = fakeInteraction.options._getArg(name);
					return resolveUser(val);
				} catch (_e) {
					return null;
				}
			},
			getMember: (name) => {
				try {
					const val = fakeInteraction.options._getArg(name);
					return resolveMember(val);
				} catch (_e) {
					return null;
				}
			},
			getChannel: (name) => {
				try {
					const val = fakeInteraction.options._getArg(name);
					return resolveChannel(val);
				} catch (_e) {
					return null;
				}
			},
			getRole: (name) => {
				try {
					const val = fakeInteraction.options._getArg(name);
					return resolveRole(val);
				} catch (_e) {
					return null;
				}
			},
			getAttachment: (name) => {
				try {
					if (!message.attachments || message.attachments.size === 0)
						return null;
					if (!name) return message.attachments.first();

					const lower = String(name).toLowerCase();
					return (
						message.attachments.find((att) =>
							att.name?.toLowerCase().includes(lower),
						) || message.attachments.first()
					);
				} catch (_e) {
					return null;
				}
			},
			getMentionable: (name) => {
				try {
					const user = fakeInteraction.options.getUser(name);
					if (user) return user;

					const role = fakeInteraction.options.getRole(name);
					if (role) return role;

					if (message.mentions?.users?.size > 0)
						return message.mentions.users.first();
					if (message.mentions?.roles?.size > 0)
						return message.mentions.roles.first();
					return null;
				} catch (_e) {
					return null;
				}
			},
		},

		deferUpdate: () => {
			return;
		},
		isCommand: () => true,
		isRepliable: () => true,
		isChatInputCommand: () => true,
		isMessageComponent: () => false,
		isAutocomplete: () => false,
		isModalSubmit: () => false,
		inGuild: () => !!message.guild,
		toString: () => `[FakeInteraction/${commandName}]`,
	};

	for (const key of [
		'user',
		'member',
		'guild',
		'channel',
		'client',
		'createdTimestamp',
		'id',
	]) {
		if (typeof fakeInteraction[key] === 'undefined') {
			fakeInteraction[key] = null;
		}
	}

	return fakeInteraction;
}

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

module.exports = { kythiaInteraction, createMockEventArgs };
