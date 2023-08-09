const { SlashCommandBuilder, spoiler } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('flip')
        .setDescription('Flip a coin!'),
    async execute(interaction) {
        const options = ["Heads", "Tails"]
        const randomNumber = Math.floor(Math.random() * 2)
        const outcome = options[randomNumber];

        await interaction.reply(`ooh baby you got a **${spoiler(outcome)}**!`)
    }
}
