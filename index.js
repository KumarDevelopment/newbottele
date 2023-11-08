const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const token = '6342143604:AAH5RvNjlZwadPhDT3AAg6Dz7P2Z4_Kq2rY';
const bot = new TelegramBot(token, { polling: true });
const app = express();
// Enable CORS for a specific origin
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'https://fiewinback.com');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});
const port = process.env.PORT || 3000;

// Sample JSON data
const jsonData = {
  allowedDomains: [
    "example.com",
    "example2.com",
    "example3.com"
  ]
};

// Define a route for /api/data.json
app.get('/api/data.json', (req, res) => {
  // Return the JSON data as a response
  res.json(jsonData);
});

// Function to fetch JSON data from your domain
const fetchDataFromURL = async () => {
  // Update apiUrl with your actual domain
  const apiUrl = 'https://domanactivationtelegrambot--kumarwebdevelop.repl.co/api/data.json';

  try {
    const response = await axios.get(apiUrl);
    return response.data;
  } catch (error) {
    console.error('Error fetching JSON data:', error);
    return null;
  }
};

app.use(express.static('public'));
app.use(cors());

bot.onText(/\/allow (.+)/, (msg, match) => {
  const domain = match[1].toLowerCase();
  if (!jsonData.allowedDomains.includes(domain)) {
    jsonData.allowedDomains.push(domain);
    bot.sendMessage(msg.chat.id, `Access to ${domain} has been allowed.`);
  } else {
    bot.sendMessage(msg.chat.id, `Access to ${domain} is already allowed.`);
  }
});

bot.onText(/\/disallow (.+)/, (msg, match) => {
  const domain = match[1].toLowerCase();
  const index = jsonData.allowedDomains.indexOf(domain);
  if (index !== -1) {
    jsonData.allowedDomains.splice(index, 1);
    bot.sendMessage(msg.chat.id, `Access to ${domain} has been disallowed.`);
  } else {
    bot.sendMessage(msg.chat.id, `Access to ${domain} is not in the allowed list.`);
  }

  // Notify the Vue.js app that the allowed domains have been updated (you can use websockets or any other method).
  // For example, you can emit an event or send a signal to the Vue.js app to refresh its data.
});

// ...

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});