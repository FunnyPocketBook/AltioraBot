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
  if (!message.content.startsWith(prefix) || message.author.bot) return;
  const wholeMessage = message.content.split('\n');
  const args = wholeMessage.shift().slice(prefix.length).trim().split(/\s+/);
  // Since the command needs to be in the first line of the message, 
  // everything that follows the second line is the actual textcontent of the message
  const messageText = wholeMessage.join('\n');
  const command = args.shift().toLowerCase();
  if (command === 'autoschedule') {
    Poll.autoSchedule(message, args, messageText);
  }
  if (command === 'autovote') {
    Poll.autoVote(message, args, messageText);
  }
  if (command === 'autopoll') {
    Poll.autoPoll(message, args, messageText);
  }
  if (command === 'autorolepoll') {
    Poll.autoRolePoll(message, args, messageText);
  }
});

client.login(config.botToken);