import Discord from 'discord.js';
import config from './config.js';
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
  if (message.author.bot) return;
  if (message.content.includes(`${prefix}autoschedule`)) {
    Poll.autoschedule(message);
  }
  if (message.content.includes(`${prefix}autovote`)) {
    Poll.autovote(message);
  }
  if (message.content.includes(`${prefix}autopoll`)) {
    Poll.autopoll(message);
  }
  if (message.content.includes(`${prefix}autopoll`)) {
    Poll.autopoll(message);
  }
  if (message.content.includes(`${prefix}autorolepoll`)) {
    Poll.autorolepoll(message);
  }
});

client.login(config.botToken);