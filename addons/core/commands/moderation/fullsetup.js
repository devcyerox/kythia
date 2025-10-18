/**
 * @namespace: addons/core/commands/moderation/fullsetup.js
 * @type: Command
 * @copyright © 2025 kenndeclouv
 * @assistant chaa & graa
 * @version 0.9.9-beta-rc.4
 */

const logger = require('@src/utils/logger');
const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, MessageFlags, InteractionContextType } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('automod-setup')
        .setDescription('Installs/re-installs a set of 6 core AutoMod rules.')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
        .setContexts(InteractionContextType.Guild),
    permissions: PermissionFlagsBits.ManageGuild,
    botPermissions: PermissionFlagsBits.ManageGuild,

    async execute(interaction) {
        await interaction.deferReply({ flags: MessageFlags.Ephemeral });

        const { guild, client } = interaction;
        const botId = client.user.id;
        const createdRules = [];
        const totalRules = 6;

        // Helper: update status with embed
        const updateStatus = async (ruleName) => {
            createdRules.push(ruleName);
            const statusEmbed = new EmbedBuilder()
                .setColor('Yellow')
                .setTitle('⚙️ AutoMod Rules Installation Progress')
                .setDescription(
                    `**Status:** Installing new rule...\n` +
                        `**Completed:** ${createdRules.length} / ${totalRules}\n` +
                        `**Last Created:** \`${ruleName}\``
                )
                .addFields({
                    name: 'Rules Created So Far',
                    value: createdRules.length > 0 ? createdRules.map((r) => `• ${r}`).join('\n') : 'None yet.',
                })
                .setFooter({ text: 'Kythia AutoMod System' });
            await interaction.editReply({ content: '', embeds: [statusEmbed] });
        };

        try {
            // ===== AUTOMATIC CLEANUP STEP =====
            const cleaningEmbed = new EmbedBuilder()
                .setColor('Blurple')
                .setTitle('🔍 Cleaning Up Old Rules')
                .setDescription('Searching and cleaning up old rules created by Kythia...');
            await interaction.editReply({ content: '', embeds: [cleaningEmbed] });

            const existingRules = await guild.autoModerationRules.fetch();
            const kythiaRules = existingRules.filter((rule) => rule.name.startsWith('[Kythia]'));

            if (kythiaRules.size > 0) {
                const foundEmbed = new EmbedBuilder()
                    .setColor('Orange')
                    .setTitle('🗑️ Removing Old Rules')
                    .setDescription(`Found **${kythiaRules.size}** old rule(s). Deleting...`);
                await interaction.editReply({ content: '', embeds: [foundEmbed] });

                for (const rule of kythiaRules.values()) {
                    await rule.delete('Re-installing Kythia AutoMod rules.');
                }
            }

            // 1. PRESETS: Block Bad Words (triggerType: 4 - KEYWORD_PRESET)
            await guild.autoModerationRules.create({
                name: '[Kythia] Block Bad Words (Presets)',
                creatorId: botId,
                enabled: true,
                eventType: 1,
                triggerType: 4, // KEYWORD_PRESET
                triggerMetadata: { presets: [1, 2, 3] }, // 1: Profanity, 2: Sexual Content, 3: Slurs
                actions: [{ type: 1 }],
            });
            await updateStatus('Block Bad Words (All Presets)');

            // 2. SPAM: Block Suspected Spam (triggerType: 3 - SPAM)
            await guild.autoModerationRules.create({
                name: '[Kythia] Block Suspected Spam',
                creatorId: botId,
                enabled: true,
                eventType: 1,
                triggerType: 3, // SPAM
                triggerMetadata: {}, // This field is required to be present, but empty object is fine for spam
                actions: [{ type: 1 }],
            });
            await updateStatus('Block Suspected Spam');

            // 3. MENTION SPAM: Block Mass Mentions (triggerType: 5 - MENTION_SPAM)
            await guild.autoModerationRules.create({
                name: '[Kythia] Block Mass Mentions (Users & Roles)',
                creatorId: botId,
                enabled: true,
                eventType: 1,
                triggerType: 5, // MENTION_SPAM
                triggerMetadata: {
                    mentionTotalLimit: 6, // Total mention limit (user + role)
                },
                actions: [{ type: 1 }],
            });
            await updateStatus('Block Mass Mentions (Combined)');

            // 4. INVITE LINK: Block Discord Invites (triggerType: 1 - KEYWORD)
            await guild.autoModerationRules.create({
                name: '[Kythia] Block Discord Invites',
                creatorId: botId,
                enabled: true,
                eventType: 1,
                triggerType: 1, // KEYWORD
                triggerMetadata: {
                    keywordFilter: ['discord.gg/', 'discord.com/invite/'],
                },
                actions: [{ type: 1 }],
            });
            await updateStatus('Block Discord Invites');

            // 5. SCAM LINK: Block Scam & Phishing Links (triggerType: 1 - KEYWORD)
            await guild.autoModerationRules.create({
                name: '[Kythia] Block Scam & Phishing Links',
                creatorId: botId,
                enabled: true,
                eventType: 1,
                triggerType: 1, // KEYWORD
                triggerMetadata: {
                    keywordFilter: [
                        'nitro for free',
                        'free steam',
                        'steamcommunily',
                        'disord.gift',
                        '.ru/gift',
                        '.xyz/gift',
                        '.gift',
                        'airdrop',
                        'steamgift',
                    ],
                },
                actions: [{ type: 1 }],
            });
            await updateStatus('Block Scam & Phishing Links');

            // 6. CAPS LOCK: Block Excessive Caps (triggerType: 1 - KEYWORD, using regexPatterns)
            await guild.autoModerationRules.create({
                name: '[Kythia] Block Excessive Caps',
                creatorId: botId,
                enabled: true,
                eventType: 1,
                triggerType: 1, // KEYWORD (regexPatterns supported as of Discord's API)
                triggerMetadata: {
                    regexPatterns: [
                        // Example: message with 30 or more uppercase letters or numbers (no lower case): up to 200 chars
                        '^[A-Z0-9\\s!@#$%^&*()_+\\-=\\[\\]{}|;\':",.<>/?`~]{30,}$'
                    ],
                    allowList: [],
                },
                actions: [{ type: 1 }],
            });
            await updateStatus('Block Excessive Caps');

            // FINISHED
            const successEmbed = new EmbedBuilder()
                .setColor('Green')
                .setTitle(`✅ Successfully Installed ${totalRules} AutoMod Rule(s)!`)
                .setDescription(`**${totalRules} AutoMod rules** have been successfully re-installed. Your server is now clean and protected!`)
                .addFields({ name: 'Installed Rules', value: createdRules.map((r) => `• ${r}`).join('\n') })
                .setFooter({ text: 'Kythia AutoMod System' });

            await interaction.editReply({ content: '', embeds: [successEmbed] });
        } catch (error) {
            logger.error('Error during AutoMod setup:', error);
            const errorEmbed = new EmbedBuilder()
                .setColor('Red')
                .setTitle('❌ Setup Failed!')
                .setDescription(
                    "An error occurred during setup. Make sure I have the **'Manage Server'** permission and my bot is up-to-date.\n\nTry running this command again."
                )
                .addFields({
                    name: 'Rules Successfully Created',
                    value: createdRules.length > 0 ? createdRules.map((r) => `• ${r}`).join('\n') : 'None, everything was cleaned up.',
                })
                .setFooter({ text: 'Kythia AutoMod System' });

            await interaction.editReply({ content: '', embeds: [errorEmbed] });
        }
    },
};
