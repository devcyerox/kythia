/**
 * @namespace: addons/economy/commands/coinflip.js
 * @type: Command
 * @copyright © 2025 kenndeclouv
 * @assistant chaa & graa
 * @version 0.9.9-beta-rc.5
 */
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const KythiaUser = require('@coreModels/KythiaUser');
const { embedFooter } = require('@utils/discord');
const { t } = require('@utils/translator');

module.exports = {
    subcommand: true,
    data: (subcommand) =>
        subcommand
            .setName('coinflip')
            .setDescription('🪙 Flip a coin and test your luck.')
            .addIntegerOption((option) => option.setName('bet').setDescription('Amount to bet').setRequired(true))
            .addStringOption((option) =>
                option
                    .setName('side')
                    .setDescription('Heads or Tails')
                    .setRequired(true)
                    .addChoices({ name: 'Heads', value: 'heads' }, { name: 'Tails', value: 'tails' })
            ),
    async execute(interaction) {
        await interaction.deferReply();
        let user = await KythiaUser.getCache({ userId: interaction.user.id });
        if (!user) {
            const embed = new EmbedBuilder()
                .setColor(kythia.bot.color)
                .setDescription(await t(interaction, 'economy.withdraw.no.account.desc'))
                .setThumbnail(interaction.user.displayAvatarURL())
                .setFooter(await embedFooter(interaction));
            return interaction.editReply({ embeds: [embed] });
        }
        const bet = interaction.options.getInteger('bet');
        const side = interaction.options.getString('side').toLowerCase();

        if (user.kythiaCoin < bet) {
            const embed = new EmbedBuilder()
                .setColor('Red')
                .setDescription(await t(interaction, 'economy.coinflip.coinflip.not.enough.cash'))
                .setThumbnail(interaction.user.displayAvatarURL())
                .setFooter(await embedFooter(interaction));
            return interaction.editReply({ embeds: [embed] });
        }

        const flip = Math.random() < 0.5 ? 'heads' : 'tails';

        if (side === flip) {
            user.kythiaCoin = BigInt(user.kythiaCoin) + BigInt(bet);

            user.changed('kythiaCoin', true);

            await user.saveAndUpdateCache('userId');
            const embed = new EmbedBuilder()
                .setColor(kythia.bot.color)
                .setThumbnail(interaction.user.displayAvatarURL())
                .setDescription(
                    await t(interaction, 'economy.coinflip.coinflip.win', {
                        flip: flip.charAt(0).toUpperCase() + flip.slice(1),
                        amount: bet,
                    })
                )
                .setFooter(await embedFooter(interaction));
            return interaction.editReply({ embeds: [embed] });
        } else {
            user.kythiaCoin = BigInt(user.kythiaCoin) - BigInt(bet);

            user.changed('kythiaCoin', true);

            await user.saveAndUpdateCache('userId');
            const embed = new EmbedBuilder()
                .setColor('Red')
                .setThumbnail(interaction.user.displayAvatarURL())
                .setDescription(
                    await t(interaction, 'economy.coinflip.coinflip.lose', {
                        flip: flip.charAt(0).toUpperCase() + flip.slice(1),
                        amount: bet,
                    })
                )
                .setFooter(await embedFooter(interaction));
            return interaction.editReply({ embeds: [embed] });
        }
    },
};
