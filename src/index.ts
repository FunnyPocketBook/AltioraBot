import * as Discord from 'discord.js';
import config from './config.js';
import * as Poll from './components/poll.js'
import * as Util from './util/util.js';

// Create an instance of a Discord client
const client = new Discord.Client();
const prefix = '^';

client.on('ready', () => {
  console.log('I am ready!');
});

// Create an event listener for messages
client.on('message', message => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;
  const wholeMessage = message.content.split('\n');
  const options = wholeMessage[0].slice(prefix.length).trim().split(/\s+/);
  // Since the command needs to be in the first line of the message, 
  // everything that follows the second line is the actual textcontent of the message
  const command = options.shift().toLowerCase();
  const args = Util.argumentParser(options);
  if (command === 'autoschedule') {
    Poll.autoSchedule(message, args);
  }
  if (command === 'autovote') {
    Poll.autoVote(message, args);
  }
  if (command === 'autopoll') {
    Poll.autoPoll(message, args);
  }
  if (command === 'autorolepoll') {
    Poll.autoRolePoll(message, args);
  }
});

client.login(config.botToken);