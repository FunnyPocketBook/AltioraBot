import * as Emojis from '../util/emojis.js';

export function autoschedule(message, args, messageText) {
  message.react(Emojis.MONDAY);
  message.react(Emojis.TUESDAY);
  message.react(Emojis.WEDNESDAY);
  message.react(Emojis.THURSDAY);
  message.react(Emojis.FRIDAY);
  message.react(Emojis.SATURDAY);
  message.react(Emojis.SUNDAY);
}

export function autovote(message, args, messageText) {
  message.react(Emojis.UPVOTE);
  message.react(Emojis.DOWNVOTE);
}

export function autopoll(message, args, messageText) {
  message.react(Emojis.AGREE);
  message.react(Emojis.DISAGREE);
  message.react(Emojis.QUESTIONMARK);
}

export function autorolepoll(message, args, messageText) {
  message.react(Emojis.MAINTANK);
  message.react(Emojis.OFFTANK);
  message.react(Emojis.HITSCAN);
  message.react(Emojis.PROJECTILE);
  message.react(Emojis.FLEXSUPPORT);
  message.react(Emojis.MAINSUPPORT);
}

function argumentParser(args) {
  const sortedArguments = {};
  for (const arg of args) {
    if (arg.startsWith('-')) {
      
    }
  }
}