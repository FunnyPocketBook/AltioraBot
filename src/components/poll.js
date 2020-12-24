import * as Emojis from '../util/emojis.js';
import * as Utils from '../util/util.js';

export function autoSchedule(message, args, messageText) {
  message.react(Emojis.MONDAY);
  message.react(Emojis.TUESDAY);
  message.react(Emojis.WEDNESDAY);
  message.react(Emojis.THURSDAY);
  message.react(Emojis.FRIDAY);
  message.react(Emojis.SATURDAY);
  message.react(Emojis.SUNDAY);
}

export function autoVote(message, args, messageText) {
  message.react(Emojis.UPVOTE);
  message.react(Emojis.DOWNVOTE);
}

export function autoPoll(message, args, messageText) {
  // ^autopoll -timer 1h -reminder 45m 5m -ping @role1 @role2
  message.react(Emojis.AGREE);
  message.react(Emojis.DISAGREE);
  message.react(Emojis.QUESTIONMARK);
  const options = Utils.argumentParser(args);
  if (options.timer) {
    timer(message, options);
  }
  if (options.reminder) {
    reminder(message, options, messageText);
  }
}

export function autoRolePoll(message, args, messageText) {
  message.react(Emojis.MAINTANK);
  message.react(Emojis.OFFTANK);
  message.react(Emojis.HITSCAN);
  message.react(Emojis.PROJECTILE);
  message.react(Emojis.FLEXSUPPORT);
  message.react(Emojis.MAINSUPPORT);
}

function timer(message, args) {
  const seconds = Utils.humanTimeToSeconds(args.timer[0]);
  setTimeout(async function() {
    let max = 0;
    const maxReaction = [];
    message = await message.fetch();
    for (const reaction of Array.from(message.reactions.cache)) {
      const count = reaction[1].count;
      if (count > max) {
        max = count;
      }
    }
    for (const reaction of Array.from(message.reactions.cache)) {
      if (max === reaction[1].count) {
        maxReaction.push(reaction[1].emoji);
      }
    }
    if (maxReaction.length > 1) {
      message.reply(`${args.ping ? args.ping.join(', ') : ''} your poll has closed and there was a tie between: ${maxReaction.join(', ')}!`);
    } else {
      message.reply(`${args.ping ? args.ping.join(', ') : ''} your poll has closed, the winner is: ${maxReaction[0]}!`);
    }
  }, seconds * 1000);
}

function reminder(message, args, messageText) {
  const pollEnd = Utils.humanTimeToSeconds(args.timer[0]);
  const seconds = args.reminder.map(t => pollEnd - Utils.humanTimeToSeconds(t));
  for (const reminder of seconds) {
    setTimeout(() => {
      message.reply(`${args.ping ? args.ping.join(', ') : ''} the poll is closing in ${new Date((pollEnd - reminder) * 1000).toISOString().substr(11, 8)}\n> ${messageText.replace(/\n/g, '\n> ')}\n${message.url}`);
    }, reminder * 1000)
  }
}