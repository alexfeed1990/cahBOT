const eris = require("eris");
const Constants = eris.Constants;
const fs = require("node:fs");
const path = require("node:fs");
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

    },
};
