const { Events } = require('discord.js');
const axios = require('axios');
const { username, lightId, clientKey, lightIp } = require('../config.json');
// Philips Hue settings
const BRIDGE_IP = lightIp; // e.g. '192.168.1.2'
const USERNAME = username; // Generated API username for your Hue bridge
const LIGHT_ID = lightId; // The ID of the light you want to control
const key = clientKey// Client Key

module.exports = {
	name: Events.MessageCreate,
	async execute(message) {
        const targetChannelId = '1072035768987566140'; // Replace with your channel ID

        if (message.channel.id === targetChannelId) {
            console.log(`Message received in target channel: ${message.content}`);
            try 
            {
                // Example: Change the color based on message content
                let color = 46920;  // Default to blue
                if (message.content.includes('red')) color = 0;       // Red
                if (message.content.includes('green')) color = 25500; // Green
            
                // Change light and make it blink
                await changeLight(color);
            } 
            catch (error) 
            {
                console.error(`The light function did not work`);
                console.error(error);
            }
        }
	},
};

// Function to change the light color and make it blink
const changeLight = async (color) => {
	try {
	  	// Change light color (assuming it's an RGB capable light)
		await axios.put(`http://${BRIDGE_IP}/api/${USERNAME}/groups/${LIGHT_ID}/action`, {
		"on": true,
		"hue": color,  // Hue value between 0-65535 for colors
		"sat": 254,    // Saturation (254 = full color)
		"bri": 254     // Brightness (254 = full brightness)
		});
		// Make the light blink
		await axios.put(`http://${BRIDGE_IP}/api/${USERNAME}/groups/${LIGHT_ID}/action`, {
			"alert": "breathe"  // lselect makes it blink, "select" for one blink
		});
	} catch (error) {
	  	console.error("Error changing light state:", error);
	}
};
  

  