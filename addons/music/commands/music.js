/**
 * @namespace: addons/music/commands/music.js
 * @type: Command
 * @copyright © 2025 kenndeclouv
 * @assistant chaa & graa
 * @version 0.10.1-beta
 */
const {
	SlashCommandBuilder,
	GuildMember,
	PermissionFlagsBits,
	InteractionContextType,
} = require('discord.js');
const { formatTrackDuration, hasControlPermission } = require('../helpers');

module.exports = {
	slashCommand: new SlashCommandBuilder()
		.setName('music')
		.setDescription('🎵 Full music command suite using Lavalink')
		.addSubcommand((subcommand) =>
			subcommand
				.setName('play')
				.setDescription('🎶 Play a song or add it to the queue')
				.addStringOption((option) =>
					option
						.setName('search')
						.setDescription(
							'Song title or URL (YouTube, Spotify (can be playlist link))',
						)
						.setRequired(true)
						.setAutocomplete(true),
				),
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName('pause')
				.setDescription('⏸️ Pause the currently playing song'),
		)
		.addSubcommand((subcommand) =>
			subcommand.setName('resume').setDescription('▶️ Resume the paused song'),
		)
		.addSubcommand((subcommand) =>
			subcommand.setName('skip').setDescription('⏭️ Skip the current song'),
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName('stop')
				.setDescription('⏹️ Stop music and clear the queue'),
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName('queue')
				.setDescription('📜 Show the current song queue'),
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName('nowplaying')
				.setDescription('ℹ️ Show the currently playing song'),
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName('shuffle')
				.setDescription('🔀 Shuffle the queue order'),
		)
		.addSubcommand((subcommand) =>
			subcommand.setName('back').setDescription('⏮️ Play the previous song'),
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName('loop')
				.setDescription('🔁 Set repeat mode')
				.addStringOption((option) =>
					option
						.setName('mode')
						.setDescription('Choose repeat mode')
						.setRequired(true)
						.addChoices(
							{ name: '❌ Off', value: 'none' },
							{ name: '🔂 Track', value: 'track' },
							{ name: '🔁 Queue', value: 'queue' },
						),
				),
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName('volume')
				.setDescription('🔊 Set music volume')
				.addIntegerOption((option) =>
					option
						.setName('level')
						.setDescription('Volume level (1-1000)')
						.setRequired(true)
						.setMinValue(1)
						.setMaxValue(1000),
				),
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName('autoplay')
				.setDescription('🔄 Enable or disable autoplay')
				.addStringOption((option) =>
					option
						.setName('status')
						.setDescription('Enable or disable autoplay')
						.addChoices(
							{ name: 'Enable', value: 'enable' },
							{ name: 'Disable', value: 'disable' },
						),
				),
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName('filter')
				.setDescription('🎧 Apply audio filter (equalizer)'),
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName('remove')
				.setDescription('🗑️ Remove a song from queue')
				.addIntegerOption((option) =>
					option
						.setName('position')
						.setDescription('Position in queue to remove')
						.setRequired(true),
				),
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName('move')
				.setDescription('🔀 Move a song to different position')
				.addIntegerOption((option) =>
					option
						.setName('from')
						.setDescription('Current position')
						.setRequired(true),
				)
				.addIntegerOption((option) =>
					option.setName('to').setDescription('New position').setRequired(true),
				),
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName('lyrics')
				.setDescription('🎤 Show the lyrics of the currently playing song'),
		)
		.addSubcommandGroup((subcommandGroup) =>
			subcommandGroup
				.setName('playlist')
				.setDescription('Manage your personal music playlists.')
				.addSubcommand((subcommand) =>
					subcommand
						.setName('save')
						.setDescription('Saves the current queue as a new playlist.')
						.addStringOption((option) =>
							option
								.setName('name')
								.setDescription('The name for your new playlist.')
								.setRequired(true),
						),
				)
				.addSubcommand((subcommand) =>
					subcommand
						.setName('load')
						.setDescription('Clears the queue and loads a playlist.')
						.addStringOption((option) =>
							option
								.setName('name')
								.setDescription('The name of the playlist to load.')
								.setRequired(true)
								.setAutocomplete(true),
						),
				)
				.addSubcommand((subcommand) =>
					subcommand
						.setName('append')
						.setDescription('Adds songs from a playlist to the current queue.')
						.addStringOption((option) =>
							option
								.setName('name')
								.setDescription('The name of the playlist to append.')
								.setRequired(true)
								.setAutocomplete(true),
						),
				)
				.addSubcommand((subcommand) =>
					subcommand
						.setName('list')
						.setDescription('Shows all of your saved playlists.'),
				)
				.addSubcommand((subcommand) =>
					subcommand
						.setName('delete')
						.setDescription('Deletes one of your playlists.')
						.addStringOption((option) =>
							option
								.setName('name')
								.setDescription('The name of the playlist to delete.')
								.setRequired(true)
								.setAutocomplete(true),
						),
				)
				.addSubcommand((subcommand) =>
					subcommand
						.setName('rename')
						.setDescription('Renames one of your playlists.')
						.addStringOption((option) =>
							option
								.setName('name')
								.setDescription('The name of the playlist to rename.')
								.setRequired(true)
								.setAutocomplete(true),
						)
						.addStringOption((option) =>
							option
								.setName('new_name')
								.setDescription('The new name of the playlist.')
								.setRequired(true),
						),
				)
				.addSubcommand((subcommand) =>
					subcommand
						.setName('track-remove')
						.setDescription('Removes a track from one of your playlists.')
						.addStringOption((option) =>
							option
								.setName('name')
								.setDescription(
									'The name of the playlist to remove the track from.',
								)
								.setRequired(true)
								.setAutocomplete(true),
						)
						.addIntegerOption((option) =>
							option
								.setName('position')
								.setDescription('The position of the track to remove.')
								.setRequired(true),
						),
				)
				.addSubcommand((subcommand) =>
					subcommand
						.setName('track-list')
						.setDescription('Shows the list of tracks in a playlist.')
						.addStringOption((option) =>
							option
								.setName('name')
								.setDescription(
									'The name of the playlist to show the list of tracks from.',
								)
								.setRequired(true)
								.setAutocomplete(true),
						),
				)
				.addSubcommand((subcommand) =>
					subcommand
						.setName('track-add')
						.setDescription('Adds a single song to one of your playlists.')
						.addStringOption((option) =>
							option
								.setName('name')
								.setDescription('The name of the playlist to add the song to.')
								.setRequired(true)
								.setAutocomplete(true),
						)
						.addStringOption((option) =>
							option
								.setName('search')
								.setDescription('The song title or URL to add.')
								.setRequired(true)
								.setAutocomplete(true),
						),
				)
				.addSubcommand((subcommand) =>
					subcommand
						.setName('import')
						.setDescription(
							`Import Playlist from ${kythia.bot.name} playlist code or external services like Spotify.`,
						)
						.addStringOption((option) =>
							option
								.setName('code')
								.setDescription(
									`${kythia.bot.name} playlist code or Spotify URL to import.`,
								)
								.setRequired(true),
						),
				)
				.addSubcommand((subcommand) =>
					subcommand
						.setName('share')
						.setDescription(`Share ${kythia.bot.name} playlist with others.`)
						.addStringOption((option) =>
							option
								.setName('name')
								.setDescription(
									`The name of the ${kythia.bot.name} playlist to share.`,
								)
								.setRequired(true)
								.setAutocomplete(true),
						),
				),
		)
		.addSubcommand((subcommand) =>
			subcommand.setName('clear').setDescription('🗑️ Clears the current queue.'),
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName('seek')
				.setDescription('⏩ Seeks to a specific time in the current song.')
				.addStringOption((option) =>
					option
						.setName('time')
						.setDescription('The time to seek to. eg. 10, 2:30, 1:20:30')
						.setRequired(true),
				),
		)
		.addSubcommandGroup((subcommandGroup) =>
			subcommandGroup
				.setName('favorite')
				.setDescription('💖 Manage your favorite songs.')
				.addSubcommand((subcommand) =>
					subcommand
						.setName('play')
						.setDescription('🎶 Play all songs from your favorites.')
						.addBooleanOption((option) =>
							option
								.setName('append')
								.setDescription('Append the songs to the current queue.')
								.setRequired(false),
						),
				)
				.addSubcommand((subcommand) =>
					subcommand
						.setName('list')
						.setDescription('🌟 Show your favorite songs.'),
				)
				.addSubcommand((subcommand) =>
					subcommand
						.setName('add')
						.setDescription('💖 Add a song to your favorites.')
						.addStringOption((option) =>
							option
								.setName('search')
								.setDescription('The song title or URL to add.')
								.setRequired(true)
								.setAutocomplete(true),
						),
				)
				.addSubcommand((subcommand) =>
					subcommand
						.setName('remove')
						.setDescription('💖 Remove a song from your favorites.')
						.addStringOption((option) =>
							option
								.setName('name')
								.setDescription('The name of the song to remove.')
								.setRequired(true)
								.setAutocomplete(true),
						),
				),
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName('247')
				.setDescription(
					'🎧 Enable or disable 24/7 mode to keep the bot in the voice channel.',
				),
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName('radio')
				.setDescription('📻 Search and play live radio stations worldwide')
				.addStringOption((option) =>
					option
						.setName('search')
						.setDescription(
							'Name of the radio station (e.g., Prambors, BBC, Lofi)',
						)
						.setRequired(true)
						.setAutocomplete(true),
				),
		)
		.setContexts(InteractionContextType.Guild),
	cooldown: 15,
	permissions: [
		PermissionFlagsBits.Speak,
		PermissionFlagsBits.Connect,
		PermissionFlagsBits.ViewChannel,
		PermissionFlagsBits.SendMessages,
	],
	botPermissions: [
		PermissionFlagsBits.Speak,
		PermissionFlagsBits.Connect,
		PermissionFlagsBits.SendMessages,
	],
	aliases: ['music', 'm', '🎵'],
	defaultArgument: 'search',

	/**
	 * 🔎 Handles autocomplete for the 'play' subcommand.
	 * Suggests top YouTube search results based on user input.
	 * @param {import('discord.js').AutocompleteInteraction} interaction
	 * @param {import('discord.js').Client} client
	 */
	async autocomplete(interaction, container) {
		const { client, logger, models } = container;
		const { Favorite, Playlist } = models;
		const focusedOption = interaction.options.getFocused(true);
		const focusedValue = focusedOption.value;
		const subcommand = interaction.options.getSubcommand(false);
		const subcommandgroup = interaction.options.getSubcommandGroup(false);

		if (
			(focusedOption.name === 'search' &&
				(subcommand === 'play' || subcommand === 'track-add')) ||
			(subcommandgroup === 'favorite' &&
				subcommand === 'add' &&
				focusedOption.name === 'search')
		) {
			if (focusedValue.toLowerCase().includes('spotify')) {
				const truncatedUrl =
					focusedValue.length > 50
						? `${focusedValue.slice(0, 47)}...`
						: focusedValue;
				return interaction.respond([
					{
						name: `🎵 Play Spotify: ${truncatedUrl}`,
						value: focusedValue,
					},
				]);
			} else if (focusedValue.toLowerCase().includes('youtube')) {
				const truncatedUrl =
					focusedValue.length > 50
						? `${focusedValue.slice(0, 47)}...`
						: focusedValue;
				return interaction.respond([
					{
						name: `🎵 Play Youtube: ${truncatedUrl}`,
						value: focusedValue,
					},
				]);
			} else if (/^https?:\/\//.test(focusedValue)) {
				const truncatedUrl =
					focusedValue.length > 60
						? `${focusedValue.slice(0, 57)}...`
						: focusedValue;
				return interaction.respond([
					{
						name: `🎵 Play from URL: ${truncatedUrl}`,
						value: focusedValue,
					},
				]);
			}

			if (!client._musicAutocompleteCache)
				client._musicAutocompleteCache = new Map();
			const searchCache = client._musicAutocompleteCache;

			if (searchCache.has(focusedValue)) {
				return interaction.respond(searchCache.get(focusedValue));
			}

			if (!focusedValue || focusedValue.trim().length === 0) {
				return interaction.respond([]);
			}

			if (/^https?:\/\//.test(focusedValue)) {
				return interaction.respond([]);
			}

			if (!client.poru || typeof client.poru.resolve !== 'function') {
				logger.error(
					'Autocomplete search failed: client.poru or client.poru.resolve is undefined',
				);
				return interaction.respond([]);
			}

			try {
				const source = kythia.addons.music.defaultPlatform || 'ytsearch';
				const res = await client.poru.resolve({
					query: focusedValue,
					source: source,
					requester: interaction.user,
				});
				if (
					!res ||
					!res.tracks ||
					!Array.isArray(res.tracks) ||
					res.tracks.length === 0
				) {
					return interaction.respond([]);
				}
				const choices = res.tracks
					.slice(0, kythia.addons.music.autocompleteLimit)
					.map((choice) => ({
						name: `🎵 ${choice.info.title.length > 80 ? `${choice.info.title.slice(0, 77)}…` : choice.info.title} [${formatTrackDuration(choice.info.length)}]`,
						value: choice.info.uri,
					}));
				searchCache.set(focusedValue, choices);
				return interaction.respond(choices);
			} catch (e) {
				logger.error('Autocomplete search failed:', e?.stack ? e.stack : e);
				return interaction.respond([]);
			}
		}

		if (subcommandgroup === 'playlist' && focusedOption.name === 'name') {
			try {
				const userPlaylists = await Playlist.getAllCache({
					where: { userId: interaction.user.id },
					limit: 25,
					cacheTags: [`Playlist:byUser:${interaction.user.id}`],
				});
				if (!userPlaylists) return interaction.respond([]);
				const filteredChoices = userPlaylists
					.map((playlist) => playlist.name)
					.filter((name) =>
						name.toLowerCase().includes(focusedValue.toLowerCase()),
					)
					.map((name) => ({ name: `🎵 ${name}`, value: name }));
				return interaction.respond(filteredChoices.slice(0, 25));
			} catch (error) {
				logger.error('Playlist autocomplete error:', error);
				return interaction.respond([]);
			}
		}

		if (subcommandgroup === 'favorite' && focusedOption.name === 'name') {
			try {
				const userFavorites = await Favorite.getAllCache({
					where: { userId: interaction.user.id },
					limit: 25,
					cacheTags: [`Favorite:byUser:${interaction.user.id}`],
				});
				if (!userFavorites) return interaction.respond([]);
				const filteredChoices = userFavorites
					.map((favorite) => favorite.title)
					.filter((name) =>
						name.toLowerCase().includes(focusedValue.toLowerCase()),
					)
					.map((name) => ({
						name: `🎵 ${name}`,
						value: String(name).slice(0, 100),
					}));
				return interaction.respond(filteredChoices.slice(0, 25));
			} catch (error) {
				logger.error('Favorite autocomplete error:', error);
				return interaction.respond([]);
			}
		}

		if (subcommand === 'radio' && focusedOption.name === 'search') {
			// Cek cache dulu biar irit API
			if (!client._radioAutocompleteCache)
				client._radioAutocompleteCache = new Map();
			if (client._radioAutocompleteCache.has(focusedValue)) {
				return interaction.respond(
					client._radioAutocompleteCache.get(focusedValue),
				);
			}

			if (!focusedValue || focusedValue.trim().length === 0) {
				return interaction.respond([]); // Kosongin kalo belum ngetik
			}

			try {
				// Fetch ke Radio Browser API (Limit 20 biar muat di autocomplete)
				const axios = require('axios'); // Pastikan axios ada
				const response = await axios.get(
					`https://de1.api.radio-browser.info/json/stations/search?name=${encodeURIComponent(focusedValue)}&limit=20&hidebroken=true&order=clickcount&reverse=true`,
					{ timeout: 2000 },
				);

				if (!response.data || !Array.isArray(response.data))
					return interaction.respond([]);

				const choices = response.data.slice(0, 25).map((station) => {
					// Format: "Nama Radio (ID | 128kbps)"
					// Kita potong nama biar gak kepanjangan
					const name =
						station.name.length > 50
							? `${station.name.substring(0, 47)}...`
							: station.name;
					const country = station.countrycode || '🌐';
					const bitrate = station.bitrate || 0;

					return {
						name: `📻 ${name} [${country}|${bitrate}k]`,
						value: station.stationuuid, // Value-nya UUID biar unik & langsung bisa dipake play
					};
				});

				// Simpan ke cache sebentar (misal 60 detik) biar gak spam API kalo user ngetik hapus ngetik hapus
				client._radioAutocompleteCache.set(focusedValue, choices);
				setTimeout(
					() => client._radioAutocompleteCache.delete(focusedValue),
					60000,
				);

				return interaction.respond(choices);
			} catch (_e) {
				// Silent error kalo API timeout/down
				return interaction.respond([]);
			}
		}
	},

	/**
	 * 🏷️ Main command executor for all subcommands.
	 * Handles permission checks and delegates to the appropriate handler.
	 * @param {import('discord.js').ChatInputCommandInteraction} interaction
	 */
	async execute(interaction, container) {
		const { client, member, guild, options } = interaction;
		const { t, music, musicHandlers, helpers } = container;
		const { isOwner } = helpers.discord;

		// 🛡️ GUARD 1: User Voice Check
		if (!(member instanceof GuildMember) || !member.voice.channel) {
			return interaction.reply({
				content: await t(interaction, 'music.music.voice.channel.not.found'),
				ephemeral: true,
			});
		}

		const player = client.poru.players.get(guild.id);
		const subcommand = options.getSubcommand();
		const group = options.getSubcommandGroup(false);

		// -------------------------------------------------------------
		// 1️⃣ CREATION HANDLERS (Player Optional / Auto-Create)
		// -------------------------------------------------------------
		const creationHandlers = {
			playlist: musicHandlers.handlePlaylist,
			favorite: musicHandlers.handleFavorite,
			play: musicHandlers.handlePlay,
			radio: musicHandlers.handleRadio,
		};

		const creationKey = group || subcommand;
		if (creationHandlers[creationKey]) {
			return creationHandlers[creationKey](interaction, player);
		}

		// -------------------------------------------------------------
		// 🚧 BARRIER: Player & Voice Check
		// -------------------------------------------------------------
		if (!player) {
			return interaction.reply({
				content: await t(interaction, 'music.music.player.not.found'),
				ephemeral: true,
			});
		}

		if (member.voice.channel.id !== player.voiceChannel) {
			return interaction.reply({
				content: await t(interaction, 'music.music.required'),
				ephemeral: true,
			});
		}

		// -------------------------------------------------------------
		// 2️⃣ PUBLIC HANDLERS
		// -------------------------------------------------------------
		const publicHandlers = {
			nowplaying: musicHandlers.handleNowPlaying,
			lyrics: musicHandlers.handleLyrics,
			queue: musicHandlers.handleQueue,
		};

		if (publicHandlers[subcommand]) {
			return publicHandlers[subcommand](interaction, player);
		}

		// -------------------------------------------------------------
		// ⚙️ SYSTEM HANDLERS (Admin Only - BYPASS TRACK CHECK)
		// -------------------------------------------------------------
		const systemHandlers = {
			247: musicHandlers.handle247,
		};

		if (systemHandlers[subcommand]) {
			const isAdmin =
				member.permissions.has(PermissionFlagsBits.ManageGuild) ||
				member.permissions.has(PermissionFlagsBits.Administrator) ||
				container.helpers.discord.isOwner(interaction.user.id);

			const owner = isOwner(interaction.user.id);
			if (!isAdmin && !owner) {
				return interaction.reply({
					content: await t(
						interaction,
						'music.helpers.musicManager.music.permission.denied',
					),
					ephemeral: true,
				});
			}
			return systemHandlers[subcommand](interaction, player);
		}

		// -------------------------------------------------------------
		// 🔒 BARRIER: Permission Check
		// -------------------------------------------------------------
		if (!hasControlPermission(interaction, player)) {
			return interaction.reply({
				content: await t(
					interaction,
					'music.helpers.musicManager.music.permission.denied',
				),
				ephemeral: true,
			});
		}

		// -------------------------------------------------------------
		// 3️⃣ CONTROL HANDLERS
		// -------------------------------------------------------------
		const controlHandlers = {
			pause: musicHandlers.handlePause,
			resume: musicHandlers.handleResume,
			skip: musicHandlers.handleSkip,
			stop: musicHandlers.handleStop,
			loop: musicHandlers.handleLoop,
			autoplay: musicHandlers.handleAutoplay,
			volume: musicHandlers.handleVolume,
			shuffle: musicHandlers.handleShuffle,
			filter: musicHandlers.handleFilter,
			remove: musicHandlers.handleRemove,
			move: musicHandlers.handleMove,
			clear: musicHandlers.handleClear,
			seek: musicHandlers.handleSeek,
			back: (i, p) => musicHandlers.handleBack(i, p, music.guildStates),
		};

		if (controlHandlers[subcommand]) {
			return controlHandlers[subcommand](interaction, player);
		}

		// ❓ Fallback
		return interaction.reply({
			content: await t(interaction, 'music.music.subcommand.not.found'),
			ephemeral: true,
		});
	},
};
