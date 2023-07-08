const eris = require("eris");
const Constants = eris.Constants;

module.exports = {
    data: {
        name: "faq",
        description: "Frequently Asked Questions, of course.",
        type: Constants.ApplicationCommandTypes.CHAT_INPUT
    },
    async execute(interaction) {
        return interaction.createMessage("There are none yet because no one uses the bot.\nWhat a surprise!");
    },
};
