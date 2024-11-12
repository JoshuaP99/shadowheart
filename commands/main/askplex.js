const { SlashCommandBuilder } = require('discord.js');
const fetch = require('node-fetch')
const xml2js = require('xml2js');
const { plexIp, plexToken } = require('../../config.json')

// Replace these with your Plex server details
const PLEX_SERVER_URL = `http://${plexIp}`; // Default port is 32400
const PLEX_TOKEN = plexToken;
const LIBRARY_NAME = 'Movies'; // e.g., 'Movies', 'TV Shows'

const MAX_MESSAGE_LENGTH = 2000;

function splitMessage(text) {
    const messages = [];
    while (text.length > MAX_MESSAGE_LENGTH) {
        const splitIndex = text.lastIndexOf('\n', MAX_MESSAGE_LENGTH);
        messages.push(text.slice(0, splitIndex));
        text = text.slice(splitIndex + 1);
    }
    messages.push(text);
    return messages;
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('askplex')
        .setDescription('Search if a movie exists in the plex library'),
    async execute(interaction) {
        try {
            await interaction.deferReply(); // Notify Discord the reply is in progress
            
            // Fetch all libraries and find the library by name
            const librariesResponse = await fetch(`${PLEX_SERVER_URL}/library/sections?X-Plex-Token=${PLEX_TOKEN}`);
            const librariesData = await librariesResponse.text();
            
            // Parse XML response to JSON
            const librariesJson = await xml2js.parseStringPromise(librariesData);
            const libraries = librariesJson.MediaContainer.Directory;

            // Find the library ID by name
            const library = libraries.find(lib => lib.$.title === LIBRARY_NAME);
            if (!library) {
                return interaction.reply(`Library "${LIBRARY_NAME}" not found.`);
            }
            const libraryId = library.$.key;

            // Fetch the titles in the specific library
            const titlesResponse = await fetch(`${PLEX_SERVER_URL}/library/sections/${libraryId}/all?X-Plex-Token=${PLEX_TOKEN}`);
            const titlesData = await titlesResponse.text();
        
            // Parse titles XML response to JSON
            const titlesJson = await xml2js.parseStringPromise(titlesData);
            const titles = titlesJson.MediaContainer.Video.map(video => video.$.title);

            console.log()

            if (titles.length === 0) {
                return interaction.reply(`No titles found in the "${LIBRARY_NAME}" library.`);
            }

            const formattedList = titles.join('\n');
            const messages = splitMessage(`**Titles in ${LIBRARY_NAME} Library:**\n${formattedList}`);

            for (const message of messages) {
                await interaction.followUp(message);
            }
        } catch (error) {
            console.error(error);
            await interaction.reply('An error occurred while fetching titles from Plex.');
        }
    },
};