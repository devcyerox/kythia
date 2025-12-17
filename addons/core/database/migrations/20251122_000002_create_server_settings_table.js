/**
 * @namespace: addons/core/database/migrations/20251122_000002_create_server_settings_table.js
 * @type: Database Migration
 * @copyright © 2025 kenndeclouv
 * @assistant chaa & graa
 * @version 0.11.0-beta
 */

module.exports = {
	async up(queryInterface, DataTypes) {
		await queryInterface.createTable('server_settings', {
			// GENERAL SETTING
			guildId: { type: DataTypes.STRING, allowNull: false, primaryKey: true },
			guildName: { type: DataTypes.STRING, allowNull: true },
			lang: { type: DataTypes.STRING, defaultValue: 'en' },
			prefix: { type: DataTypes.STRING, allowNull: true },

			// AUTOMOD
			whitelist: { type: DataTypes.JSON, defaultValue: [] },
			badwords: { type: DataTypes.JSON, defaultValue: [] },
			badwordWhitelist: { type: DataTypes.JSON, defaultValue: [] },
			admins: { type: DataTypes.JSON, defaultValue: [] },
			ignoredChannels: { type: DataTypes.JSON, defaultValue: [] },
			modLogChannelId: { type: DataTypes.STRING },
			auditLogChannelId: { type: DataTypes.STRING },

			// SERVER STATS
			serverStats: { type: DataTypes.JSON, defaultValue: [] },
			serverStatsCategoryId: { type: DataTypes.STRING, allowNull: true },

			// FEATURE ON/OFF
			antiInviteOn: { type: DataTypes.BOOLEAN, defaultValue: false },
			antiLinkOn: { type: DataTypes.BOOLEAN, defaultValue: false },
			antiSpamOn: { type: DataTypes.BOOLEAN, defaultValue: false },
			antiBadwordOn: { type: DataTypes.BOOLEAN, defaultValue: false },
			antiMentionOn: { type: DataTypes.BOOLEAN, defaultValue: false },
			antiAllCapsOn: { type: DataTypes.BOOLEAN, defaultValue: false },
			antiEmojiSpamOn: { type: DataTypes.BOOLEAN, defaultValue: false },
			antiZalgoOn: { type: DataTypes.BOOLEAN, defaultValue: false },
			serverStatsOn: { type: DataTypes.BOOLEAN, defaultValue: false },

			adventureOn: { type: DataTypes.BOOLEAN, defaultValue: false },
			levelingOn: { type: DataTypes.BOOLEAN, defaultValue: false },

			welcomeInOn: { type: DataTypes.BOOLEAN, defaultValue: false },
			welcomeOutOn: { type: DataTypes.BOOLEAN, defaultValue: false },

			minecraftStatsOn: { type: DataTypes.BOOLEAN, defaultValue: false },
			streakOn: { type: DataTypes.BOOLEAN, defaultValue: false },

			invitesOn: { type: DataTypes.BOOLEAN, defaultValue: false },

			rolePrefixOn: { type: DataTypes.BOOLEAN, defaultValue: false },

			boostLogOn: { type: DataTypes.BOOLEAN, defaultValue: false },

			// LEVELING
			// 1. XP Formula & Curve
			levelingCurve: {
				type: DataTypes.ENUM('linear', 'exponential', 'constant'),
				defaultValue: 'linear',
			},
			levelingMultiplier: { type: DataTypes.FLOAT, defaultValue: 1.0 }, // Bisa koma (misal 1.5x)
			levelingMaxLevel: { type: DataTypes.INTEGER, allowNull: true }, // Null = Unlimited

			// 2. Message XP Config
			messageXpEnabled: { type: DataTypes.BOOLEAN, defaultValue: true },
			messageXpMode: {
				type: DataTypes.ENUM('random', 'per_word', 'fixed'),
				defaultValue: 'random',
			},
			messageXpMin: { type: DataTypes.INTEGER, defaultValue: 15 },
			messageXpMax: { type: DataTypes.INTEGER, defaultValue: 25 },
			messageXpCooldown: { type: DataTypes.INTEGER, defaultValue: 60 }, // Detik

			// 3. Voice XP Config
			voiceXpEnabled: { type: DataTypes.BOOLEAN, defaultValue: true },
			voiceXpMin: { type: DataTypes.INTEGER, defaultValue: 15 },
			voiceXpMax: { type: DataTypes.INTEGER, defaultValue: 40 },
			voiceXpCooldown: { type: DataTypes.INTEGER, defaultValue: 180 }, // Detik (biasanya lebih lama)
			voiceMinMembers: { type: DataTypes.INTEGER, defaultValue: 2 }, // Minimal ada 2 orang biar dapet XP
			voiceAntiAfk: { type: DataTypes.BOOLEAN, defaultValue: true }, // Gak dapet XP kalau deafen/mute

			// 4. Reaction XP (Fitur Baru)
			reactionXpEnabled: { type: DataTypes.BOOLEAN, defaultValue: false },
			reactionXpAward: {
				type: DataTypes.ENUM('none', 'both', 'author', 'reactor'),
				defaultValue: 'both',
			},
			reactionXpMin: { type: DataTypes.INTEGER, defaultValue: 1 },
			reactionXpMax: { type: DataTypes.INTEGER, defaultValue: 5 },
			reactionXpCooldown: { type: DataTypes.INTEGER, defaultValue: 10 },

			// 5. Level Up Message
			levelingChannelId: { type: DataTypes.STRING, allowNull: true }, // Null = Current Channel
			levelingMessage: {
				type: DataTypes.TEXT,
				defaultValue: 'GG {user.mention}, you reached level **{user.level}**!',
			},
			levelingImageEnabled: { type: DataTypes.BOOLEAN, defaultValue: true }, // Kirim gambar rank card pas naik level?

			// 6. Role Rewards & Boosters
			roleRewards: { type: DataTypes.JSON, defaultValue: [] }, // [{level: 5, roleId: '123'}]
			roleRewardStack: { type: DataTypes.BOOLEAN, defaultValue: false }, // Hapus role lama kalau naik level?

			xpBoosters: { type: DataTypes.JSON, defaultValue: [] }, // [{roleId: '123', multiplier: 2.0}]
			channelBoosters: { type: DataTypes.JSON, defaultValue: [] }, // [{channelId: '123', multiplier: 1.5}]
			stackBoosters: { type: DataTypes.BOOLEAN, defaultValue: true }, // Gabungin semua booster?

			// 7. Restrictions (No XP)
			noXpChannels: { type: DataTypes.JSON, defaultValue: [] }, // Array Channel ID
			noXpRoles: { type: DataTypes.JSON, defaultValue: [] }, // Array Role ID

			// 8. Advanced / Misc
			threadXpEnabled: { type: DataTypes.BOOLEAN, defaultValue: true },
			forumXpEnabled: { type: DataTypes.BOOLEAN, defaultValue: true },
			textInVoiceXpEnabled: { type: DataTypes.BOOLEAN, defaultValue: true },
			slashCommandXpEnabled: { type: DataTypes.BOOLEAN, defaultValue: true },

			// Auto Reset (Kalau member leave)
			autoResetXp: { type: DataTypes.BOOLEAN, defaultValue: false },

			// WELCOMER GLOBAL
			welcomeInChannelId: { type: DataTypes.STRING, allowNull: true },
			welcomeOutChannelId: { type: DataTypes.STRING, allowNull: true },
			welcomeRoleId: { type: DataTypes.STRING, allowNull: true },

			// WELCOME IN
			welcomeInEmbedText: { type: DataTypes.TEXT, allowNull: true },
			welcomeInBannerWidth: { type: DataTypes.INTEGER, defaultValue: 800 },
			welcomeInBannerHeight: { type: DataTypes.INTEGER, defaultValue: 300 },
			welcomeInBackgroundUrl: { type: DataTypes.STRING, allowNull: true },
			welcomeInForegroundUrl: { type: DataTypes.STRING, allowNull: true },
			welcomeInOverlayColor: {
				type: DataTypes.STRING,
				defaultValue: 'rgba(0,0,0,0.4)',
			},

			welcomeInAvatarEnabled: { type: DataTypes.BOOLEAN, defaultValue: true },
			welcomeInAvatarSize: { type: DataTypes.INTEGER, defaultValue: 128 },
			welcomeInAvatarShape: {
				type: DataTypes.ENUM('circle', 'square'),
				defaultValue: 'circle',
			},
			welcomeInAvatarYOffset: { type: DataTypes.INTEGER, defaultValue: -20 },
			welcomeInAvatarBorderWidth: {
				type: DataTypes.INTEGER,
				defaultValue: 4,
			},
			welcomeInAvatarBorderColor: {
				type: DataTypes.STRING,
				defaultValue: '#FFFFFF',
			},

			welcomeInMainTextContent: {
				type: DataTypes.TEXT,
				defaultValue: 'WELCOMEIn, {username}!',
			},
			welcomeInMainTextFont: {
				type: DataTypes.STRING,
				defaultValue: 'bold 42px Poppins-Bold',
			},
			welcomeInMainTextFontFamily: {
				type: DataTypes.STRING,
				defaultValue: 'Poppins-Bold',
			},
			welcomeInMainTextColor: {
				type: DataTypes.STRING,
				defaultValue: '#FFFFFF',
			},
			welcomeInMainTextYOffset: {
				type: DataTypes.INTEGER,
				defaultValue: -80,
			},

			welcomeInSubTextContent: {
				type: DataTypes.TEXT,
				defaultValue: 'You are the #{memberCount} member',
			},
			welcomeInSubTextFont: {
				type: DataTypes.STRING,
				defaultValue: '32px Poppins-Bold',
			},
			welcomeInSubTextFontFamily: {
				type: DataTypes.STRING,
				defaultValue: 'Poppins-Bold',
			},
			welcomeInSubTextColor: {
				type: DataTypes.STRING,
				defaultValue: '#FFFFFF',
			},
			welcomeInSubTextYOffset: { type: DataTypes.INTEGER, defaultValue: 100 },

			welcomeInShadowColor: {
				type: DataTypes.STRING,
				defaultValue: 'rgba(0,0,0,0.5)',
			},
			welcomeInShadowBlur: { type: DataTypes.INTEGER, defaultValue: 5 },

			welcomeInBorderColor: {
				type: DataTypes.STRING,
				defaultValue: '#FFFFFF',
			},
			welcomeInBorderWidth: { type: DataTypes.INTEGER, defaultValue: 4 },

			welcomeInExtraDraw: {
				type: DataTypes.STRING,
				defaultValue: 'classicCentered',
			},

			// WELCOME OUT (mirror of WELCOME IN)
			welcomeOutEmbedText: { type: DataTypes.TEXT, allowNull: true },
			welcomeOutBannerWidth: { type: DataTypes.INTEGER, defaultValue: 800 },
			welcomeOutBannerHeight: { type: DataTypes.INTEGER, defaultValue: 300 },
			welcomeOutBackgroundUrl: { type: DataTypes.STRING, allowNull: true },
			welcomeOutForegroundUrl: { type: DataTypes.STRING, allowNull: true },
			welcomeOutOverlayColor: {
				type: DataTypes.STRING,
				defaultValue: 'rgba(0,0,0,0.4)',
			},

			welcomeOutAvatarEnabled: {
				type: DataTypes.BOOLEAN,
				defaultValue: true,
			},
			welcomeOutAvatarSize: { type: DataTypes.INTEGER, defaultValue: 128 },
			welcomeOutAvatarShape: {
				type: DataTypes.ENUM('circle', 'square'),
				defaultValue: 'circle',
			},
			welcomeOutAvatarYOffset: { type: DataTypes.INTEGER, defaultValue: -20 },
			welcomeOutAvatarBorderWidth: {
				type: DataTypes.INTEGER,
				defaultValue: 4,
			},
			welcomeOutAvatarBorderColor: {
				type: DataTypes.STRING,
				defaultValue: '#FFFFFF',
			},

			welcomeOutMainTextContent: {
				type: DataTypes.TEXT,
				defaultValue: 'Goodbye, {username}!',
			},
			welcomeOutMainTextFont: {
				type: DataTypes.STRING,
				defaultValue: 'bold 42px Poppins-Bold',
			},
			welcomeOutMainTextFontFamily: {
				type: DataTypes.STRING,
				defaultValue: 'Poppins-Bold',
			},
			welcomeOutMainTextColor: {
				type: DataTypes.STRING,
				defaultValue: '#FFFFFF',
			},
			welcomeOutMainTextYOffset: {
				type: DataTypes.INTEGER,
				defaultValue: -80,
			},

			welcomeOutSubTextContent: {
				type: DataTypes.TEXT,
				defaultValue: 'We hope to see you again',
			},
			welcomeOutSubTextFont: {
				type: DataTypes.STRING,
				defaultValue: '32px Poppins-Bold',
			},
			welcomeOutSubTextFontFamily: {
				type: DataTypes.STRING,
				defaultValue: 'Poppins-Bold',
			},
			welcomeOutSubTextColor: {
				type: DataTypes.STRING,
				defaultValue: '#FFFFFF',
			},
			welcomeOutSubTextYOffset: {
				type: DataTypes.INTEGER,
				defaultValue: 100,
			},

			welcomeOutShadowColor: {
				type: DataTypes.STRING,
				defaultValue: 'rgba(0,0,0,0.5)',
			},
			welcomeOutShadowBlur: { type: DataTypes.INTEGER, defaultValue: 5 },

			welcomeOutBorderColor: {
				type: DataTypes.STRING,
				defaultValue: '#FFFFFF',
			},
			welcomeOutBorderWidth: { type: DataTypes.INTEGER, defaultValue: 4 },

			welcomeOutExtraDraw: {
				type: DataTypes.STRING,
				defaultValue: 'classicCentered',
			},

			// MINECRAFT
			minecraftIp: { type: DataTypes.STRING, allowNull: true },
			minecraftPort: { type: DataTypes.INTEGER, allowNull: true },

			minecraftIpChannelId: { type: DataTypes.STRING, allowNull: true },
			minecraftPortChannelId: { type: DataTypes.STRING, allowNull: true },
			minecraftStatusChannelId: { type: DataTypes.STRING, allowNull: true },
			minecraftPlayersChannelId: { type: DataTypes.STRING, allowNull: true },

			// AI
			aiChannelIds: { type: DataTypes.JSON, defaultValue: [] },

			// Testimony
			testimonyChannelId: { type: DataTypes.STRING, allowNull: true },
			feedbackChannelId: { type: DataTypes.STRING, allowNull: true },
			testimonyCount: { type: DataTypes.BIGINT, defaultValue: 0 },
			testimonyCountFormat: { type: DataTypes.STRING, allowNull: true }, // testimony-{count} || {count}-testi
			testimonyCountChannelId: { type: DataTypes.STRING, allowNull: true },

			// STORE
			openCloseType: {
				type: DataTypes.ENUM(
					'channelname',
					'channelmessage',
					'channelnameandmessage',
				),
				allowNull: true,
			},
			openCloseChannelId: { type: DataTypes.STRING, allowNull: true },
			openChannelNameFormat: { type: DataTypes.STRING, allowNull: true },
			closeChannelNameFormat: { type: DataTypes.STRING, allowNull: true },
			openChannelMessageFormat: { type: DataTypes.JSON, defaultValue: [] },
			closeChannelMessageFormat: { type: DataTypes.JSON, defaultValue: [] },

			// STREAK
			streakRoleRewards: { type: DataTypes.JSON, defaultValue: [] },
			streakEmoji: { type: DataTypes.STRING, allowNull: true },
			streakMinimum: { type: DataTypes.INTEGER, defaultValue: 3 },

			announcementChannelId: { type: DataTypes.STRING, allowNull: true },
			inviteChannelId: { type: DataTypes.STRING, allowNull: true },

			boostLogChannelId: { type: DataTypes.STRING, allowNull: true },
			boostLogMessage: { type: DataTypes.TEXT, allowNull: true },

			botName: { type: DataTypes.STRING, allowNull: true },
			botAvatarUrl: { type: DataTypes.STRING, allowNull: true },
			botBannerUrl: { type: DataTypes.STRING, allowNull: true },
			botBio: { type: DataTypes.TEXT, allowNull: true },
		});
	},

	async down(queryInterface) {
		await queryInterface.dropTable('server_settings');
	},
};
