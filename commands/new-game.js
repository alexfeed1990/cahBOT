const eris = require("eris");
const Constants = eris.Constants;
const fs = require("node:fs");
const path = require("node:path");
const buffer = require("node:buffer").Buffer;
//todo: make the game parse the files split by , and if it has takeX it does what it does and bla bal bal

module.exports = {
    data: {
        name: "new-game",
        description: "Create a new Cards Against Humanity game!",
        options: [
            {
                "name": "type",
                "description": "The type of game.",
                "type": Constants.ApplicationCommandOptionTypes.STRING,
                "required": true,
                "choices": [
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
    },
    async execute(interaction) {
        let edition;
        let players = 1;
        let normal;
        if(interaction.data.options[0] == "family") { normal = false; edition = "Family Edition"; } else { normal = true; edition = "The Adult party game."; }
    
        // assets //

        let root = path.dirname(__dirname);
        let assetsDir;
        let rulesNormal;
        let rulesFamily;
        let imageNormal;
        let imageFamily;

        if (fs.existsSync(path.join(root, "assets"))) {
            assetsDir = fs.opendirSync(path.join(root, "assets"))
        }

        if (assetsDir && fs.existsSync(path.join(root, "assets", "rulesNormal.png"))) {
            rulesNormal = fs.readFileSync(path.join(root, "assets", "rulesNormal.png"), 'base64');
            //rulesNormal = buffer.from(rulesNormal);
        }

        if (assetsDir && fs.existsSync(path.join(root, "assets", "rulesFamily.png"))) {
            rulesFamily = fs.readFileSync(path.join(root, "assets", "rulesFamily.png"), 'base64');
            //rulesFamily = buffer.from(rulesFamily);
        }

        if (assetsDir && fs.existsSync(path.join(root, "assets", "cahNormal.png"))) {
            imageNormal = fs.readFileSync(path.join(root, "assets", "cahNormal.png"), 'base64');
            //imageNormal = new buffer.from(imageNormal.split(",")[1]);
        }

        if (assetsDir && fs.existsSync(path.join(root, "assets", "cahFamily.png"))) {
            imageFamily = fs.readFileSync(path.join(root, "assets", "cahFamily.png"), 'base64');
            //imageFamily = new buffer.from(imageFamily.split(",")[1]);
        }

        // public embed //

        const publicComponents = [{
            type: Constants.ComponentTypes.ACTION_ROW,
            components: [{
                type: Constants.ComponentTypes.BUTTON,
                style: Constants.ButtonStyles.SUCCESS,
                custom_id: "join_game",
                label: "Join the game!",
                disabled: false
            }]
        }];

        const publicEmbed = [{
            title: "Cards Against Humanity: " + edition, // Title of the embed
            description: "Hosted by: " + interaction.member.mention,
            //image: normal ? imageNormal : imageFamily, //STILL CRASHES
            footer: {
                text: "Players: " + players + "/20"
            }
        }];

        // admin embed //

        const response = interaction.createMessage({
            embeds: publicEmbed,
            ephemeral: false,
            components: publicComponents
        });

    },
};
