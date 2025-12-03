/**
 * @namespace: addons/core/commands/developer/debug-cache.js
 * @type: Command
 * @copyright © 2025 kenndeclouv
 * @description: Ultimate stress test for KythiaModel (Playlist + Tracks scenario)
 */

const { SlashCommandBuilder, InteractionContextType } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('debug-cache')
		.setDescription(
			'🛠️ [DEV] Run diagnostic tests on KythiaModel (Music Edition).',
		)
		.setContexts(InteractionContextType.BotDM),
	isOwner: true,
	async execute(interaction, container) {
		const { models } = container;
		const Playlist = models.Playlist;
		const PlaylistTrack = models.PlaylistTrack;

		if (!Playlist || !PlaylistTrack) {
			return interaction.reply({
				content:
					'❌ Model `Playlist` atau `PlaylistTrack` tidak ditemukan di container.',
				ephemeral: true,
			});
		}

		await interaction.deferReply({ ephemeral: true });

		const logs = [];
		const addLog = (icon, msg) => {
			const time = new Date().toISOString().split('T')[1].slice(0, 8);
			logs.push(`\`[${time}]\` ${icon} ${msg}`);
		};

		const userId = interaction.user.id;
		const testName = `DEBUG_CACHE_TEST_${Date.now()}`;
		let step = 1;
		let playlistId = null;

		try {
			// ---------------------------------------------------------
			// 0. DIAGNOSTIC HEADER
			// ---------------------------------------------------------
			const isRedis = Playlist.isRedisConnected;
			const isShard = Playlist.isShardMode;

			addLog('🤖', `**Kythia Cache Diagnostic**`);
			addLog('🔌', `Driver: **${isRedis ? 'Redis 🔴' : 'In-Memory 🧠'}**`);
			addLog(
				'⚖️',
				`Shard Mode: **${isShard ? 'ON (Strict)' : 'OFF (Hybrid)'}**`,
			);
			addLog('📦', `Cache Version: \`${Playlist.CACHE_VERSION}\``);
			logs.push('-------------------------------------------');

			// ---------------------------------------------------------
			// 1. CREATE PARENT (Playlist) - DB Write + Cache Set
			// ---------------------------------------------------------
			const startInit = Date.now();
			const [playlist, created] = await Playlist.findOrCreateWithCache({
				where: { userId: userId, name: testName },
				defaults: {
					userId: userId,
					name: testName,
					shareCode: `DBG-${Date.now()}`,
					createdAt: new Date(),
					updatedAt: new Date(),
				},
			});
			playlistId = playlist.id;
			const tInit = Date.now() - startInit;

			addLog('✅', `**Step ${step++}: Playlist Created**`);
			addLog(
				'⏱️',
				`Time: ${tInit}ms | ID: \`${playlistId}\` | Created: ${created}`,
			);

			// ---------------------------------------------------------
			// 2. CREATE CHILD (Track) - Testing Relations & BigInt
			// ---------------------------------------------------------
			await PlaylistTrack.create({
				playlistId: playlist.id,
				title: 'Kythia Anthem (Cache Ver)',
				identifier: 'dQw4w9WgXcQ',
				author: 'Rick Astley',
				length: 212000n,
				uri: 'https://youtube.com/watch?v=dQw4w9WgXcQ',
			});
			addLog('🎵', `**Step ${step++}: Track Added** (BigInt length tested)`);

			// ---------------------------------------------------------
			// 3. CLEAR CACHE (Force Cold State)
			// ---------------------------------------------------------
			await Playlist.clearCache({ where: { id: playlistId } });
			addLog('🧹', `**Step ${step++}: Cache Cleared** (Force DB Hit next)`);

			// ---------------------------------------------------------
			// 4. COLD FETCH (DB HIT) - Expecting Associations
			// ---------------------------------------------------------
			const startCold = Date.now();

			const coldResult = await Playlist.getCache({
				where: { id: playlistId },
				include: [{ model: PlaylistTrack, as: 'tracks' }],
			});
			const tCold = Date.now() - startCold;

			if (!coldResult) throw new Error('Cold fetch returned NULL!');

			const tracksCold = coldResult.tracks;
			if (
				!tracksCold ||
				!Array.isArray(tracksCold) ||
				tracksCold.length === 0
			) {
				throw new Error(
					'❌ Association FAILED on Cold Fetch! Cek `include` di model.',
				);
			}

			addLog('🧊', `**Step ${step++}: COLD Get (DB Hit)** -> ${tCold}ms`);
			addLog(
				'info',
				`Tracks found: ${tracksCold.length} | Type: ${coldResult.constructor.name}`,
			);

			// ---------------------------------------------------------
			// 5. WARM FETCH (CACHE HIT) - The Critical Test
			// ---------------------------------------------------------
			const startWarm = Date.now();
			const warmResult = await Playlist.getCache({
				where: { id: playlistId },
				include: ['tracks'],
			});
			const tWarm = Date.now() - startWarm;

			if (!warmResult) throw new Error('Warm fetch returned NULL!');

			const isInstance = warmResult instanceof Playlist;

			const tracksWarm = warmResult.tracks;
			const isHydrated =
				tracksWarm && Array.isArray(tracksWarm) && tracksWarm.length > 0;

			const trackOne = tracksWarm?.[0];
			const lengthType = trackOne ? typeof trackOne.length : 'undefined';

			addLog(
				tWarm < 20 ? '🚀' : '⚠️',
				`**Step ${step++}: WARM Get (Cache Hit)** -> ${tWarm}ms`,
			);

			if (!isHydrated) {
				throw new Error(
					"❌ CACHE CORRUPT: Relasi 'tracks' hilang saat fetch dari Redis!",
				);
			}

			addLog('🔍', `**Deep Check:**`);
			addLog(
				'├─',
				`Is Model Instance? ${isInstance ? '✅ YES' : '❌ NO (Plain Object!)'}`,
			);
			addLog('├─', `Has Tracks? ✅ YES (${tracksWarm.length})`);
			addLog(
				'└─',
				`BigInt Field Type: \`${lengthType}\` (Value: ${trackOne?.length})`,
			);

			if (!isInstance) {
				logs.push(
					`⚠️ **WARNING:** Hasil cache bukan instance Sequelize. Method .save() tidak akan jalan! Cek logic \`build()\` kamu.`,
				);
			}

			// ---------------------------------------------------------
			// 6. SAVE & UPDATE (Write-Through Test)
			// ---------------------------------------------------------
			warmResult.name = `${testName} [UPDATED]`;

			const startSave = Date.now();
			await warmResult.saveAndUpdateCache();
			const tSave = Date.now() - startSave;

			addLog('💾', `**Step ${step++}: saveAndUpdateCache** -> ${tSave}ms`);

			// ---------------------------------------------------------
			// 7. VERIFY WRITE-THROUGH
			// ---------------------------------------------------------
			const startVerify = Date.now();
			const verifyResult = await Playlist.getCache({
				where: { id: playlistId },
				include: ['tracks'],
			});
			const tVerify = Date.now() - startVerify;

			const isNameUpdated = verifyResult.name.includes('[UPDATED]');

			addLog('🧐', `**Step ${step++}: Verification Fetch** -> ${tVerify}ms`);
			if (isNameUpdated) {
				addLog('✅', `Cache Consistency: **SYNCED** (Data updated in cache)`);
			} else {
				addLog('❌', `Cache Consistency: **STALE** (Data in cache is old!)`);
				logs.push(
					`⚠️ *Hint: Pastikan saveAndUpdateCache melakukan setCacheEntry, bukan cuma invalidation.*`,
				);
			}

			// ---------------------------------------------------------
			// FINISH
			// ---------------------------------------------------------
			const embed = {
				title: '🛠️ Kythia Cache Debugger',
				description: logs.join('\n'),
				color: isHydrated && isNameUpdated ? 0x00ff00 : 0xffaa00,
				footer: { text: `Kythia System v${Playlist.CACHE_VERSION}` },
			};

			await interaction.editReply({ embeds: [embed] });
		} catch (error) {
			console.error(error);
			const errorEmbed = {
				title: '💥 CRITICAL FAILURE',
				description: `${logs.join('\n')}\n\n**ERROR at Step ${step}:**\n\`\`\`js\n${error.message}\n\`\`\``,
				color: 0xff0000,
			};
			await interaction.editReply({ embeds: [errorEmbed] });
		} finally {
			// ---------------------------------------------------------
			// CLEANUP (Always Run)
			// ---------------------------------------------------------
			if (playlistId) {
				await Playlist.destroy({ where: { id: playlistId } }).catch(() => {});
				if (Playlist.isRedisConnected) {
					await Playlist.clearCache({ where: { id: playlistId } }).catch(
						() => {},
					);
				}
			}
		}
	},
};
