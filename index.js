// Requires idk i've never nodded //

const dotenv = require("dotenv");
const Eris = require("eris");
const fs = require("node:fs");
const path = require("node:path");
dotenv.config();

const Constants = Eris.Constants;
let commands;
let commandsDir;

const bot = new Eris(process.env.TOKEN, {
	intents: []
});

bot.on("ready", async () => { // When the bot is ready
	console.log("Ready!"); // Log "Ready!"

	commands = await bot.getCommands();
	commandsDir = fs.readdirSync("commands").filter(file => file.endsWith('.js'));
});

bot.on("error", (err) => {
	console.error(err);
});

bot.on("interactionCreate", (interaction) => {
	if (interaction instanceof Eris.CommandInteraction) {
		// IMPORTANT: You must have your filename be the exact same as your commands name otherwise the bot will not find it.
		// I'm thinking of ways to fix it but for now, I don't think there are any ways to fix it that are not purely stupid.
		const commandPath = path.join(__dirname, "commands", interaction.data.name + ".js");
		if(!fs.existsSync(commandPath)) return interaction.createMessage("if you see this, the command has not been implemented yet.");
		
		const commandRequire = require(commandPath);
		if ('execute' in commandRequire) {
			try {
				commandRequire.execute(interaction);
			} catch {
				if(interaction.acknowledged) {
					return interaction.followUp("There was an error while executing this command.");
				} else {
					return interaction.createMessage("There was an error while executing this command.");
				}
			}
		} else {
			console.warn(`The command at ${filePath} is missing the "execute" property.`);
		}
	}
});

bot.connect();