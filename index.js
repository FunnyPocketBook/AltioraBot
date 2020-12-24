import Discord from 'discord.js';
import config from './config.json';
import * as Poll from './components/poll.js'

// Create an instance of a Discord client
const client = new Discord.Client();
const prefix = '^';

/**
 * The ready event is vital, it means that only _after_ this will your bot start reacting to information
 * received from Discord
 */
client.on('ready', () => {
  console.log('I am ready!');
});

// Create an event listener for messages
client.on('message', message => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;
  const wholeMessage = message.content.split('\n');
  const args = wholeMessage.shift().slice(prefix.length).trim().split(' ');
  // Since the command needs to be in the first line of the message, 
  // everything that follows the second line is the actual textcontent of the message
  const messageText = wholeMessage.join('\n');
  const command = args?.shift().toLowerCase();
  if (command === 'autoschedule') {
    Poll.autoschedule(message, args, messageText);
  }
  if (command === 'autovote') {
    Poll.autovote(message, args, messageText);
  }
  if (command === 'autopoll') {
    Poll.autopoll(message, args, messageText);
  }
  if (command === 'autorolepoll') {
    Poll.autorolepoll(message, args, messageText);
  }
});

client.login(config.botToken);