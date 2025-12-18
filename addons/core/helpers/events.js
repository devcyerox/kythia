/**
 * @namespace: addons/core/helpers/events.js
 * @type: Helper Script
 * @copyright © 2025 kenndeclouv
 * @assistant chaa & graa
 * @version 0.11.0-beta
 */

/**
 * Membuat objek interaction palsu dari sebuah Message.
 * Smart Interaction Mocker dengan Parser V2 (Support Subcommand Group)
 * @param {import('discord.js').Message} message - Objek pesan asli.
 * @param {string} commandName - Nama command yang dijalankan.
 * @param {string} rawArgsString - String argumen mentah.
 * @returns {object} Objek interaction palsu yang sangat kompatibel.
 */
function kythiaInteraction(message, commandName, rawArgsString) {
	let replied = false;
	let deferred = false;
	let replyMessage = null;
	const followUpMessages = [];

	const argsPattern = /([^\s"]+|"[^"]*")+/g;
	const rawTokens =
		rawArgsString.match(argsPattern)?.map((t) => t.replace(/^"|"$/g, '')) || [];

	const client = message.client;
	const targetCommand = client.commands.get(commandName);

	let resolvedGroup = null;
	let resolvedSubcommand = null;
	const resolvedOptions = [];
	const remainingArgs = [...rawTokens];

	if (remainingArgs.length > 0 && targetCommand) {
		const potentialGroup = remainingArgs[0].toLowerCase();

		const slashData = targetCommand.slashCommand || targetCommand.data;
		const groupOption = slashData?.options?.find(
			(opt) =>
				opt.name === potentialGroup &&
				(opt.type === 2 ||
					opt.constructor.name === 'SlashCommandSubcommandGroupBuilder'),
		);

		if (groupOption) {
			resolvedGroup = potentialGroup;
			remainingArgs.shift();
		}
	}

	if (remainingArgs.length > 0) {
		const potentialSub = remainingArgs[0].toLowerCase();

		const slashData = targetCommand?.slashCommand || targetCommand?.data;
		const hasSubcommands = slashData?.options?.some(
			(opt) =>
				opt.type === 1 ||
				opt.constructor.name === 'SlashCommandSubcommandBuilder',
		);

		if (resolvedGroup || hasSubcommands) {
			resolvedSubcommand = potentialSub;
			remainingArgs.shift();
		}
	}

	let finalSchema = targetCommand?.slashCommand || targetCommand?.data;

	if (resolvedGroup) {
		finalSchema = finalSchema.options.find((o) => o.name === resolvedGroup);
	}
	if (resolvedSubcommand) {
		const optionsSource = resolvedGroup
			? finalSchema.options
			: targetCommand?.slashCommand?.options || targetCommand?.data?.options;
		finalSchema = optionsSource?.find((o) => o.name === resolvedSubcommand);
	}

	const availableOptions =
		finalSchema?.options?.filter(
			(opt) =>
				opt.type !== 1 &&
				opt.type !== 2 &&
				opt.constructor.name !== 'SlashCommandSubcommandBuilder' &&
				opt.constructor.name !== 'SlashCommandSubcommandGroupBuilder',
		) || [];

	const optionsMap = new Map();
	let positionalIndex = 0;

	function guessType(val) {
		if (!Number.isNaN(Number(val))) return 3;
		if (val === 'true' || val === 'false') return 5;

		return 3;
	}

	remainingArgs.forEach((arg) => {
		if (arg.includes(':')) {
			const [key, ...valParts] = arg.split(':');
			const val = valParts.join(':');
			resolvedOptions.push({
				name: key.toLowerCase(),
				value: val,
				type: guessType(val),
			});
			optionsMap.set(key.toLowerCase(), val);
		} else if (positionalIndex < availableOptions.length) {
			const targetOption = availableOptions[positionalIndex];

			resolvedOptions.push({
				name: targetOption.name.toLowerCase(),
				value: arg,
				type: targetOption.type || guessType(arg),
			});
			optionsMap.set(targetOption.name.toLowerCase(), arg);

			positionalIndex++;
		}
	});

	const resolveUser = (val) => {
		if (!val) return null;
		const id = val.replace(/[<@!>]/g, '');
		return message.client.users.cache.get(id) || null;
	};
	const resolveMember = (val) => {
		const user = resolveUser(val);
		return user ? message.guild?.members.cache.get(user.id) || null : null;
	};
	const resolveChannel = (val) => {
		if (!val) return null;
		const id = val.replace(/[<#>]/g, '');
		return message.guild?.channels.cache.get(id) || null;
	};
	const resolveRole = (val) => {
		if (!val) return null;
		const id = val.replace(/[<@&>]/g, '');
		return message.guild?.roles.cache.get(id) || null;
	};

	const fakeInteraction = {
		type: 2,
		id: message.id,
		applicationId: message.client.application?.id,
		channelId: message.channel.id,
		guildId: message.guild?.id,
		user: message.author,
		member: message.member,
		guild: message.guild,
		channel: message.channel,
		client: message.client,
		commandName: commandName,
		commandType: 1,
		commandId: '0',
		locale: message.guild?.preferredLocale || 'en-US',
		guildLocale: message.guild?.preferredLocale || 'en-US',
		createdTimestamp: message.createdTimestamp,
		get createdAt() {
			return new Date(this.createdTimestamp);
		},

		get deferred() {
			return deferred;
		},
		get replied() {
			return replied;
		},
		set deferred(v) {
			deferred = v;
		},
		set replied(v) {
			replied = v;
		},

		deferReply: async (opts) => {
			if (replied || deferred) throw new Error('Already replied/deferred');
			deferred = true;
			replyMessage = await message.channel
				.send({ content: '⏳ ...', ...opts })
				.catch(() => null);
			return replyMessage;
		},
		editReply: async (opts) => {
			// const content = typeof opts === 'string' ? opts : opts.content;
			// const embeds = opts.embeds || [];
			// const components = opts.components || [];

			if (replyMessage && replyMessage.content === '⏳ ...') {
				await replyMessage.delete().catch(() => {});
				replyMessage = await message.channel.send(opts).catch(() => null);
			} else if (replyMessage) {
				replyMessage = await replyMessage.edit(opts).catch(() => null);
			} else {
				replyMessage = await message.channel.send(opts).catch(() => null);
			}
			replied = true;
			return replyMessage;
		},
		reply: async (opts) => {
			if (replied || deferred) return fakeInteraction.editReply(opts);
			replied = true;
			replyMessage = await message.channel.send(opts).catch(() => null);
			return replyMessage;
		},
		followUp: async (opts) => {
			const msg = await message.channel.send(opts).catch(() => null);
			if (msg) followUpMessages.push(msg);
			return msg;
		},
		deleteReply: async () => {
			if (replyMessage) await replyMessage.delete().catch(() => {});
			replyMessage = null;
		},
		fetchReply: async () => {
			return await replyMessage;
		},

		options: {
			client: message.client,
			data: resolvedOptions,
			resolved: {
				users: new Map(),
				members: new Map(),
				channels: new Map(),
				roles: new Map(),
				messages: new Map(),
				attachments: new Map(),
			},
			_group: resolvedGroup,
			_subcommand: resolvedSubcommand,
			_hoistedOptions: resolvedOptions,

			_getTypedOption: (name, required) => {
				const opt = resolvedOptions.find((o) => o.name === name.toLowerCase());
				if (!opt && required) {
					throw new Error(
						`CommandInteractionOptionResolver: Option "${name}" is required but was not found.`,
					);
				}
				return opt || null;
			},

			get: (name, required) => {
				return fakeInteraction.options._getTypedOption(name, required);
			},
			getSubcommand: (required) => {
				if (!resolvedSubcommand && required) {
					throw new Error(
						'CommandInteractionOptionResolver: Subcommand is required but was not found.',
					);
				}
				return resolvedSubcommand;
			},
			getSubcommandGroup: (required) => {
				if (!resolvedGroup && required) {
					throw new Error(
						'CommandInteractionOptionResolver: Subcommand group is required but was not found.',
					);
				}
				return resolvedGroup;
			},

			getString: (name, required) => {
				const val = optionsMap.get(name.toLowerCase());
				if (val === undefined && required) {
					throw new Error(
						`CommandInteractionOptionResolver: String option "${name}" is required.`,
					);
				}
				return val || null;
			},
			getBoolean: (name, required) => {
				const val = optionsMap.get(name.toLowerCase());
				if (val === undefined && required) {
					throw new Error(
						`CommandInteractionOptionResolver: Boolean option "${name}" is required.`,
					);
				}
				if (val === undefined) return null;
				return val.toLowerCase() === 'true' || val === '1';
			},
			getInteger: (name, required) => {
				const val = optionsMap.get(name.toLowerCase());
				if (val === undefined && required) {
					throw new Error(
						`CommandInteractionOptionResolver: Integer option "${name}" is required.`,
					);
				}
				return val ? parseInt(val, 10) : null;
			},
			getNumber: (name, required) => {
				const val = optionsMap.get(name.toLowerCase());
				if (val === undefined && required) {
					throw new Error(
						`CommandInteractionOptionResolver: Number option "${name}" is required.`,
					);
				}
				return val ? parseFloat(val) : null;
			},
			getUser: (name, required) => {
				const val = optionsMap.get(name.toLowerCase());
				const user = resolveUser(val);
				if (!user && required) {
					throw new Error(
						`CommandInteractionOptionResolver: User option "${name}" is required.`,
					);
				}
				return user;
			},
			getMember: (name) => {
				const val = optionsMap.get(name.toLowerCase());
				return resolveMember(val);
			},
			getChannel: (name, required) => {
				const val = optionsMap.get(name.toLowerCase());
				const channel = resolveChannel(val);
				if (!channel && required) {
					throw new Error(
						`CommandInteractionOptionResolver: Channel option "${name}" is required.`,
					);
				}
				return channel;
			},
			getRole: (name, required) => {
				const val = optionsMap.get(name.toLowerCase());
				const role = resolveRole(val);
				if (!role && required) {
					throw new Error(
						`CommandInteractionOptionResolver: Role option "${name}" is required.`,
					);
				}
				return role;
			},
			getAttachment: (name, required) => {
				const attachment = message.attachments.first() || null;
				if (!attachment && required) {
					throw new Error(
						`CommandInteractionOptionResolver: Attachment option "${name}" is required.`,
					);
				}
				return attachment;
			},
			getMentionable: (name, required) => {
				const val = optionsMap.get(name.toLowerCase());
				const mentionable = resolveUser(val) || resolveRole(val);
				if (!mentionable && required) {
					throw new Error(
						`CommandInteractionOptionResolver: Mentionable option "${name}" is required.`,
					);
				}
				return mentionable;
			},
			getMessage: (name, required) => {
				if (required) {
					throw new Error(
						`CommandInteractionOptionResolver: Message option "${name}" is required but not supported in mock yet.`,
					);
				}
				return null;
			},
			getFocused: (getFull) => {
				return getFull ? { name: '', value: '', type: 3 } : '';
			},
		},

		isCommand: () => true,
		isChatInputCommand: () => true,
		isContextMenuCommand: () => false,
		isMessageContextMenuCommand: () => false,
		isUserContextMenuCommand: () => false,
		isMessageComponent: () => false,
		isButton: () => false,
		isStringSelectMenu: () => false,
		isSelectMenu: () => false,
		isUserSelectMenu: () => false,
		isRoleSelectMenu: () => false,
		isMentionableSelectMenu: () => false,
		isChannelSelectMenu: () => false,
		isAutocomplete: () => false,
		isModalSubmit: () => false,
		isRepliable: () => true,
		inGuild: () => !!message.guild,
	};

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
