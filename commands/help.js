const eris = require("eris");
const Constants = eris.Constants;

module.exports = {
    data: {
        name: "help",
        description: "Pretty self-explanatory...",
        type: Constants.ApplicationCommandTypes.CHAT_INPUT
    },
    async execute(interaction) {
        return interaction.createMessage("/new-game - Creates a new CAH game!\n/help - Displays this message.\n/faq - Displays the most frequently-asked-questions (if you didn't know, that's what FAQ stands for.)");
    },
};
