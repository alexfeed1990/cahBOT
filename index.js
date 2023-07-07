// Requires idk i've never nodded //

const dotenv = require("dotenv");
const Eris = require("eris");
dotenv.config();

const Constants = Eris.Constants;

const bot = new Eris(process.env.TOKEN, {
	intents: []
});

bot.on("ready", async () => { // When the bot is ready
	console.log("Ready!"); // Log "Ready!"

	//Note: You should use guild commands to test, as they update instantly. Global commands can take up to an hour to update.

	const commands = await bot.getCommands();

	if (!commands.length) {
		bot.createCommand({
			name: "new-game",
			description: "Create a new Cards Against Humanity game!",
			options: [
				{
					"name": "type", //The name of the option
					"description": "The type of game.",
					"type": Constants.ApplicationCommandOptionTypes.STRING, //This is the type of string, see the types here https://discord.com/developers/docs/interactions/application-commands#application-command-object-application-command-option-type
					"required": true,
					"choices": [ //The possible choices for the options
						{
							"name": "Normal",
							"value": "normal"
						},
						{
							"name": "Family",
							"value": "family"
						}
					]
				}
			],
			type: Constants.ApplicationCommandTypes.CHAT_INPUT
		});

		bot.createCommand({
			name: "help",
			description: "The help command. Pretty self explanatory.",
			type: Constants.ApplicationCommandTypes.CHAT_INPUT
		});
	} else {

	}
});

bot.on("error", (err) => {
	console.error(err);
});



bot.on("interactionCreate", (interaction) => {
	if (interaction instanceof Eris.CommandInteraction) {
		/*
		switch (interaction.data.name) {
			case "new-game":
				return interaction.createMessage("code here");
			case "help":
				return interaction.createMessage("help message here uwu");
			default: {
				return interaction.createMessage("if you see this, the command has not been implemented yet.");
			}
		}
		*/

		//implement shit here
	}
});

bot.connect();