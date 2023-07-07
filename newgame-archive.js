const { ActionRowBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, SlashCommandBuilder, userMention } = require('discord.js');
const fs = require("node:fs");
const path = require("node:path");
var Jimp = require("jimp");
var Buffer = require("node:buffer");

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
        let normal = false;
        if(interaction.options.getString("type") === "cahFamily") { edition = "Family Edition"; normal = false; } else { edition = "The Adult Party Game"; normal = true; }

        // locations //

        let root = path.dirname(path.dirname(__dirname));
        let assetsDir;
        let rulesNormal;
        let rulesFamily;
        let imageNormal;
        let imageFamily;
        
        if (fs.existsSync(path.join(root, "assets"))) {
            assetsDir = fs.opendirSync(path.join(root, "assets"))
        }

        if (assetsDir && fs.existsSync(path.join(root, "assets", "rulesNormal.png"))) {
            rulesNormal = fs.readFileSync(path.join(root, "assets", "rulesNormal.png"));
            rulesNormal = Buffer.Buffer.from(rulesNormal);
        }
        
        if (assetsDir && fs.existsSync(path.join(root, "assets", "rulesFamily.png"))) {
            rulesFamily = fs.readFileSync(path.join(root, "assets", "rulesFamily.png"));
            rulesFamily = Buffer.Buffer.from(rulesFamily);
        }

        if (assetsDir && fs.existsSync(path.join(root, "assets", "cahNormal.png"))) {
            imageNormal = fs.readFileSync(path.join(root, "assets", "cahNormal.png"));
            imageNormal = Buffer.Buffer.from(imageNormal);
        }
            
        if (assetsDir && fs.existsSync(path.join(root, "assets", "cahFamily.png"))) {
            imageFamily = fs.readFileSync(path.join(root, "assets", "cahFamily.png"));
            imageFamily = Buffer.Buffer.from(imageFamily);
        }

        // public embed //

		const join = new ButtonBuilder()
			.setCustomId('join')
			.setLabel('Join the game!')
			.setStyle(ButtonStyle.Primary);

        const publicRow = new ActionRowBuilder()
			.addComponents(join);

        const publicEmbed = new EmbedBuilder()
            .setTitle("Cards Against Humanity: " + edition)
            .setDescription("Hosted by: " + userMention(interaction.user.id))
            //.setImage(normal ? imageNormal : imageFamily)
            .setFooter({ text: "Players: " + players + "/20" })
        
        // Admin embed //

        const adminEmbed = new EmbedBuilder()
            .setTitle("Admin Panel")
            .setDescription("Do NOT dismiss this message until the game has started.")
        
        const deleteButton = new ButtonBuilder()
            .setCustomId("delete")
            .setLabel("Delete Game")
            .setStyle(ButtonStyle.Danger)

        const startButton = new ButtonBuilder()
            .setCustomId("start")
            .setLabel("Start Game")
            .setStyle(ButtonStyle.Primary)
        
        const adminRow = new ActionRowBuilder()
            .addComponents(startButton, deleteButton)

        // misc embed #1 //

        const confirmationStartGameEmbed = new EmbedBuilder()
            .setTitle("Are you sure?")
            .setDescription("The recommended amount of players for a game is 4. \n Maybe if you wait more, more people will join. \n Are you sure you want to start the game?")
        
        const confirmationStartGameButton = new ButtonBuilder()
            .setCustomId("yesStart")
            .setLabel("Yes, Start the game.")
            .setStyle(ButtonStyle.Danger)
        
        const confirmationWaitGameButton = new ButtonBuilder()
            .setCustomId("noWait")
            .setLabel("No, Don't start the game.")
            .setStyle(ButtonStyle.Success)
        
        const confirmationStartGameButtonRow = new ActionRowBuilder()
            .addComponents(confirmationStartGameButton, confirmationWaitGameButton)

        // misc embed #2 //

        const cantStartGameEmbed = new EmbedBuilder()
            .setTitle("You can't start a game with yourself.")
            .setDescription("Hey, you need friends to play CAH. \n You can dismiss this message.")

        // response //

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
        const timeout = 1000 * 60 * 20; // 20 minutes

        try {
            const gameButton = await response.awaitMessageComponent({ filter: collectorFilter, time: timeout });
            const adminButton = await adminPanel.awaitMessageComponent({ filter: collectorFilter, time: timeout });

            if(gameButton.customId == "join") {
                players++
                console.log("sex sex")
                await interaction.update({ 
                    embeds: [publicEmbed],
                    ephemeral: false,
                    components: [publicRow]
                });
            }

            if(adminButton.customId == "start") {
                if(players == 1) {
                    await interaction.followUp({embeds: [cantStartGameEmbed], ephemeral: true})
                } else if(players < 4) {
                    const confirmationStartGame = await interaction.followUp({
                        embeds: [confirmationStartGameEmbed],
                        ephemeral: true,
                        components: [confirmationStartGameButtonRow]
                    })

                    const confirmationButton = await confirmationStartGame.awaitMessageComponent({filter: collectorFilter, time: timeout});

                    if(confirmationButton.customId == "yesStart") {
                        // start game
                    } else if (confirmationButton.customId == "noWait") {
                        // you can dismiss these messages now or something
                        await interaction.followUp({content: "You can now dismiss the previous messages. (except for the admin panel dont do that)", ephemeral: true});
                    }

                    // do the button checking here or something
                } else {
                    // start the game here
                }
            }
        } catch (e) {
            await interaction.editReply({ content: 'Game not started within 20 minutes, cancelling.', components: [] });
        }
	},
};
