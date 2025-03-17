// const { Events } = require('discord.js');
// const axios = require('axios');
// const puppeteer = require("puppeteer");
// const { Client, GatewayIntentBits } = require("discord.js");

// const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });
// const PRODUCT_URL = "https://www.bestbuy.com/site/nvidia-geforce-rtx-5090-32gb-gddr7-graphics-card-dark-gun-metal/6614151.p?skuId=6614151";
// const targetChannelId = '1345056998286164009'; 

// module.exports = {
// 	name: Events.ClientReady,
// 	async execute(interaction) {
// // Replace with your channel ID
//         try 
//         {
//             console.log(`Stock tracker loaded`);
//             setInterval(checkStock, 1 * 60 * 1000);
//         } 
//         catch (error) 
//         {
//             console.error(`The bot broke restart`);
//             console.error(error);
//         }
// 	},
// };

// async function sendDiscordNotification(message) {
//     const channel = await client.channels.fetch(targetChannelId);
//     if (channel) await channel.send(message);
// }

// // Function to change the light color and make it blink
// async function checkStock() {
//     const browser = await puppeteer.launch({ headless: true });
//     const page = await browser.newPage();

//     // Set User-Agent to avoid bot detection
//     await page.setUserAgent(
//         "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
//     );

//     await page.goto(PRODUCT_URL, { waitUntil: "networkidle2" });

//     try {
//         // Check the stock status
//         const stockStatus = await page.$eval(
//             ".fulfillment-add-to-cart-button",
//             (el) => el.innerText.trim()
//         );

//         console.log("Stock Status:", stockStatus);

//         if (!stockStatus.includes("Sold Out")) {
//             console.log("🚀 Item is in stock!");
//             await sendDiscordNotification("GOOOOO IN STOCK NOW 🔥🔥🔥" + PRODUCT_URL);
//         } else {
//             console.log("❌ Item is still out of stock.");
//             await sendDiscordNotification("This bitch still sold out ❌");
//         }
//     } catch (error) {
//         console.error("Error checking stock:", error);
//     }

//     await browser.close();
// }
  

  