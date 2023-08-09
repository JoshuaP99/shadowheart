const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('buildmaker')
        .setDescription('Randomized build for a new BG3 playthrough!'),
    async execute(interaction) {
        const races = ["Elf", "Tiefling", "Drow", "Human", "Githyanki", "Dwarf", "Half-Elf", "Halfling", "Gnome", "Dragonborn", "Half-Orc"]
        const classes = ["Barbarian", "Bard", "Cleric", "Druid", "Fighter", "Monk", "Paladin", "Ranger", "Rogue", "Sorcerer", "Warlock", "Wizard"]
        const alignment = ["Neutrality", "Heroism", "Evil"]

        const randomRace = races[Math.floor(Math.random() * 11)];
        const randomClass = classes[Math.floor(Math.random() * 12)];
        const randomAlignment = alignment[Math.floor(Math.random() * 3)];

        await interaction.reply(`You will be born as a **${randomRace}** with the vocation of **${randomClass}**. Your heart and mind are filled with **${randomAlignment}**`)
    }
}



