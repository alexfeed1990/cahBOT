// Requires idk i've never nodded //

const dotenv = require("dotenv");
const Eris = require("eris");
const fs = require("node:fs");
const path = require("node:path");

dotenv.config();
const bot = new Eris(process.env.TOKEN, { intents: [] });

bot.on("ready", async () => {
    console.log("Ready! Deploying commands.");

    const commands = await bot.getCommands();
    const commandsDir = fs.readdirSync("commands").filter(file => file.endsWith('.js'));
    const args = process.argv;
    if (commands.length) { for (let i = 0; i < commands.length; i++) { bot.deleteCommand(commands[i].id); } console.log("Deleted commands."); } // Deletes every command if there are any/

    commandsDir.forEach(file => {
        const filePath = path.join(__dirname, "commands", file);
        const fileRequire = require(filePath);

        if ('data' in fileRequire && 'execute' in fileRequire) {
            const commandData = {
                name: fileRequire.data.name,
                description: fileRequire.data.description,
                options: fileRequire.data.options,
                type: fileRequire.data.type
            };
        
            if(args[1] == "guild") {
                bot.createGuildCommand(process.env.GUILDID, commandData);
            } else {
                bot.createCommand(commandData);
            }

            console.log("Deployed commmand: /" + fileRequire.data.name);
        } else {
            console.warn(`The command at ${filePath} is missing a required "data" or "execute" property.`);
        }

        console.log("Deployed commands successfully!");
        process.exit();
    });
});

bot.on("error", (err) => { console.error(err); });
bot.connect();