// Require the necessary discord.js classes
const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, Events, GatewayIntentBits } = require('discord.js');
const { token } = require('./config.json');
const puppeteer = require("puppeteer");

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });
const stockChannel =  "1345056998286164009"
const itemUrl = "https://www.bestbuy.com/site/nvidia-geforce-rtx-5090-32gb-gddr7-graphics-card-dark-gun-metal/6614151.p?skuId=6614151";

client.commands = new Collection();

const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		// Set a new item in the Collection with the key as the command name and the value as the exported module
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;
	
	const command = interaction.client.commands.get(interaction.commandName);

	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
		} else {
			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
		}
	}
});

let lastStockStatus = "Sold Out"; // Store last known status to avoid duplicate notifications

async function checkStock() {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.setUserAgent(
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
    );

    await page.goto(itemUrl, { waitUntil: "networkidle2" });

    try {
        const stockStatus = await page.$eval(
            ".fulfillment-add-to-cart-button",
            (el) => el.innerText.trim()
        );

        console.log(`Stock Status: ${stockStatus} [${new Date().toLocaleTimeString()}]`);

        if (!stockStatus.includes("Sold Out") && lastStockStatus === "Sold Out") {
            lastStockStatus = stockStatus; // Update status
            await sendDiscordNotification(`🔥 The item is back in stock! Buy now: ${itemUrl}`);
        } else if (stockStatus.includes("Sold Out")) {
            lastStockStatus = "Sold Out";
        }
    } catch (error) {
        console.error("Error checking stock:", error);
    }

    await browser.close();
}

const joshua = "175401521687691266"

// Function to send Discord notification
async function sendDiscordNotification(message) {
    try {
        const channel = await client.channels.fetch(stockChannel);
        if (channel) {
            await channel.send(`<@${joshua}> ${message}`);
        } else {
        }
    } catch (error) {
        console.error("❌ Error sending Discord message:", error);
    }
}

// Run stock checker every 5 seconds (adjust as needed)
setInterval(checkStock, 5000);

// Log in to Discord with your client's token
client.login(token);