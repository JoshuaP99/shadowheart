const { SlashCommandBuilder } = require('discord.js');
const { GoogleSpreadsheet } = require('google-spreadsheet');
const fs = require('fs');

async function initializeGoogleSheet() {
    const credentials = JSON.parse(fs.readFileSync('../credentials.json'));
    const doc = new GoogleSpreadsheet('0');
    await doc.useServiceAccountAuth(credentials);
    await doc.loadInfo(); // Load sheet data
    return doc.sheetsByIndex[0]; // First sheet
  }

module.exports = {
    data: new SlashCommandBuilder()
        .setName('plexrequest')
        .setDescription('Send a request to plex')
        .addStringOption(option => option.setName('message').setDescription('Your request').setRequired(true)),
    async execute(interaction) {
        try
        {
            const sheet = new initializeGoogleSheet();
            console.log(sheet)
            const message = interaction.options.getString('message');
            const username = interaction.user.username;
    
            sheet.addRow({ Username: username, Message: message });
            await interaction.reply(`Your message has been added to the sheet, ${username}!`);
        } 
        catch
        {
            console.error(error);
            await interaction.reply('An error occurred while fetching titles from Plex.');
        }

    }
}

// // Periodically check Google Sheets for green highlights
// setInterval(async () => {
//   await sheet.loadCells(); // Load all cells for color check
//   const rows = await sheet.getRows();

//   rows.forEach(async (row, index) => {
//     const messageCell = sheet.getCell(index + 1, 1); // Assuming message is in column 1

//     if (messageCell.backgroundColor && messageCell.backgroundColor.green === 1) {
//       // Ping the user if their message cell is green
//       const user = client.users.cache.find(u => u.username === row.Username);
//       if (user) {
//         await user.send(`Your message "${row.Message}" has been highlighted!`);
//       }
//       // Optionally reset color or add another action
//     }
//   });
// }, 60000); // Check every minute