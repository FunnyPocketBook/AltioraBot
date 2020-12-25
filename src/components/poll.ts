import * as Emojis from '../util/emojis.js';
import * as Util from '../util/util.js';
import * as Discord from 'discord.js';
import { Arguments } from '../types/poll.interface.js';

export async function autoSchedule(message: Discord.Message, args: Arguments) {
  await message.react(Emojis.MONDAY);
  await message.react(Emojis.TUESDAY);
  await message.react(Emojis.WEDNESDAY);
  await message.react(Emojis.THURSDAY);
  await message.react(Emojis.FRIDAY);
  await message.react(Emojis.SATURDAY);
  message.react(Emojis.SUNDAY);
  if (args.timer) {
    timer(message, args);
  }
  if (args.reminder) {
    reminder(message, args);
  }
}

export async function autoVote(message: Discord.Message, args: Arguments) {
  await message.react(Emojis.UPVOTE);
  message.react(Emojis.DOWNVOTE);
  if (args.timer) {
    timer(message, args);
  }
  if (args.reminder) {
    reminder(message, args);
  }
}

export async function autoPoll(message: Discord.Message, args: Arguments) {
  await message.react(Emojis.AGREE);
  await message.react(Emojis.DISAGREE);
  message.react(Emojis.QUESTIONMARK);
  if (args.timer) {
    timer(message, args);
  }
  if (args.reminder) {
    reminder(message, args);
  }
}

export async function autoRolePoll(message: Discord.Message, args: Arguments) {
  await message.react(Emojis.MAINTANK);
  await message.react(Emojis.OFFTANK);
  await message.react(Emojis.HITSCAN);
  await message.react(Emojis.PROJECTILE);
  await message.react(Emojis.FLEXSUPPORT);
  message.react(Emojis.MAINSUPPORT);
  if (args.timer) {
    timer(message, args);
  }
  if (args.reminder) {
    reminder(message, args);
  }
}

function timer(message: Discord.Message, args: Arguments) {
  const seconds = Util.humanTimeToSeconds(args.timer[0]);
  setTimeout(async function() {
    let max = 0;
    const maxReaction = [];
    //message = await message.fetch();
    // Get maximum reaction count
    for (const reaction of message.reactions.cache) {
      const count = reaction[1].count;
      if (count > max) {
        max = count;
      }
    }
    // Get the reactions with maximum count
    for (const reaction of message.reactions.cache) {
      if (max === reaction[1].count) {
        maxReaction.push(reaction[1].emoji);
      }
    }
    if (maxReaction.length > 1) {
      message.reply(`${args.ping ? args.ping.join(', ') : ''} The vote has closed and there was a tie between: ${maxReaction.join(', ')}`);
    } else {
      message.reply(`${args.ping ? args.ping.join(', ') : ''} The vote has closed, the winner is: ${maxReaction}`);
    }
  }, seconds * 1000);
}

/**
 * Reminds any potential roles/members to vote for a message again.
 * @param message Discord message to reply to
 * @param args Arguments for the reminder times and to determine whether or not to ping anyone
 */
function reminder(message: Discord.Message, args: Arguments) {
  let pollEnd = -1;
  let pollEndSeconds = -1;
  if (args.timer) {
    pollEndSeconds = Util.humanTimeToSeconds(args.timer[0]);
    console.log(`Vote ends in ${pollEndSeconds} seconds.`);
  }
  for (let reminder of args.reminder) {
    const reminderSeconds = Util.humanTimeToSeconds(reminder);
    let timeoutSeconds = 0;
    let text = '';
    if (pollEndSeconds === -1) {
      console.log(`No timer set.`);
      text = 'Reminder of the vote!';
      timeoutSeconds = reminderSeconds;
    } else {
      console.log('Timer set');
      text = `The vote is closing in ${(new Date(reminderSeconds * 1000)).toISOString().substr(11, 8)}`;
      timeoutSeconds = pollEndSeconds - reminderSeconds;
    }
    setTimeout((function(text, ping) {
      return function() {
        message.reply(`${ping ? ping.join(', ') : ''} ${text}`);
      }
    })(text, args.ping), timeoutSeconds * 1000);
  }
}