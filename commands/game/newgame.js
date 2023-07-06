const { ActionRowBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, SlashCommandBuilder, userMention } = require('discord.js');
const fs = require("node:fs")
//todo: make the game parse the files split by , and if it has takeX it does what it does and bla bal bal

module.exports = {
	data: new SlashCommandBuilder()
		.setName('new-game')
		.setDescription('Starts a new game.')
        .addStringOption(option =>
            option.setName('type')
                .setDescription('Type of CAH the game is gonna use.')
                .setRequired(true)
                .addChoices(
                    { name: 'Family', value: 'cahFamily' },
                    { name: 'Normal', value: 'cahNormal' },
                )),
	async execute(interaction) {
        let edition = "";
        let players = 1;
        if(interaction.options.getString("type") === "cahFamily") { edition = "Family Edition" } else { edition = "The Adult Party Game" }

		const join = new ButtonBuilder()
			.setCustomId('join')
			.setLabel('Join the game!')
			.setStyle(ButtonStyle.Primary);

        const publicRow = new ActionRowBuilder()
			.addComponents(join);

        const publicEmbed = new EmbedBuilder()
            .setTitle("Cards Against Humanity: " + edition)
            .setDescription("Hosted by: " + userMention(interaction.user.id))
            .setFooter({ text: "Players: " + players + "/20" })
        
        const adminEmbed = new EmbedBuilder()
            .setTitle()

        const response = await interaction.reply({ 
            embeds: [publicEmbed],
            ephemeral: false,
            components: [publicRow]
        });

        const adminPanel = await interaction.followUp({
            embeds: [adminEmbed],
            ephemeral: true,
            components: [adminRow]
        })

        const collectorFilter = i => i.user.id === interaction.user.id;
        const timeout = 1000 * 60 * 20;

        try {
            const confirmation = await response.awaitMessageComponent({ filter: collectorFilter, time: timeout });

            if(confirmation.customID === "join") {
                players++
                await interaction.editReply({ 
                    embeds: [embed],
                    ephemeral: false,
                    components: [row]
                });
            }
        } catch (e) {
            await interaction.editReply({ content: 'Game not started within 20 minutes, cancelling.', components: [] });
        }
	},
};
