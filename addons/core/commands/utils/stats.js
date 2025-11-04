/**
 * @namespace: addons/core/commands/utils/stats.js
 * @type: Command
 * @copyright © 2025 kenndeclouv
 * @assistant chaa & graa
 * @version 0.9.11-beta
 */
const { EmbedBuilder, version } = require('discord.js');
const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');
const os = require('os');

function getKythiaCoreVersion() {
    try {
        const corePkgPath = require.resolve('kythia-core/package.json');
        const pkg = JSON.parse(fs.readFileSync(corePkgPath, 'utf8'));
        return pkg.version;
    } catch {
        try {
            const mainPkgPath = path.join(process.cwd(), 'package.json');
            if (fs.existsSync(mainPkgPath)) {
                const mainPkg = JSON.parse(fs.readFileSync(mainPkgPath, 'utf8'));
                return (
                    (mainPkg.dependencies && mainPkg.dependencies['kythia-core']) ||
                    (mainPkg.devDependencies && mainPkg.devDependencies['kythia-core']) ||
                    null
                );
            }
        } catch {}
    }
    return null;
}

function getGitCommitId() {
    if (process.env.GITHUB_SHA) return process.env.GITHUB_SHA.substring(0, 7);
    if (process.env.COMMIT_SHA) return process.env.COMMIT_SHA.substring(0, 7);

    try {
        const gitHeadPath = path.join(process.cwd(), '.git', 'HEAD');
        if (fs.existsSync(gitHeadPath)) {
            const head = fs.readFileSync(gitHeadPath, 'utf8').trim();
            if (head.startsWith('ref:')) {
                const refPath = head.split(' ')[1];
                const refFullPath = path.join(process.cwd(), '.git', refPath);
                if (fs.existsSync(refFullPath)) {
                    const commit = fs.readFileSync(refFullPath, 'utf8').trim();
                    return commit.substring(0, 7);
                }
            } else if (/^[0-9a-f]{40}$/i.test(head)) {
                return head.substring(0, 7);
            }
        }
    } catch (e) {}
    return undefined;
}

module.exports = {
    aliases: ['s', '📊'],
    data: new SlashCommandBuilder().setName('stats').setDescription(`📊 Displays kythia statistics.`),
    async execute(interaction, container) {
        const { t, kythiaConfig, helpers } = container;
        const { formatDuration } = helpers.time;
        const { embedFooter } = helpers.discord;

        const { client } = interaction;

        const username = interaction.client.user.username;
        const uptime = await formatDuration(client.uptime, interaction);
        const memory = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2);
        const guilds = client.guilds.cache.size;
        const users = client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0);
        let runtimeDisplay;
        if (process.versions.bun) {
            runtimeDisplay = `**Bun:** \`${process.versions.bun}\``;
        } else if (process.versions.deno) {
            runtimeDisplay = `**Deno:** \`${process.versions.deno}\``;
        } else {
            runtimeDisplay = `**Node.js:** \`${process.version}\``;
        }
        const djs = version;
        const cpu = os.cpus()[0].model;

        const botLatency = Math.max(0, Date.now() - interaction.createdTimestamp);
        const apiLatency = Math.round(client.ws.ping);
        const owner = `${kythiaConfig.owner.names} (${kythiaConfig.owner.ids})`;
        const kythiaVersion = kythiaConfig.version;
        const kythiaCoreVersion = getKythiaCoreVersion() || 'N/A';
        const githubCommit = getGitCommitId();

        const desc = await t(interaction, 'core.utils.stats.embed.desc', {
            username,
            uptime,
            memory,
            guilds,
            users,
            runtime: runtimeDisplay,
            djs,
            cpu,
            botLatency,
            apiLatency,
            owner,
            kythiaVersion,
            kythiaCoreVersion,
            githubCommit: githubCommit || 'N/A',
        });

        const embed = new EmbedBuilder()
            .setColor(kythiaConfig.bot.color)
            .setDescription(desc)
            .setThumbnail(client.user.displayAvatarURL())
            .setFooter(await embedFooter(interaction));

        await interaction.reply({ content: null, embeds: [embed] });
    },
};
