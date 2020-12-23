import * as Emojis from '../util/emojis.js';

export function autoschedule(message) {
  message.react(Emojis.MONDAY);
  message.react(Emojis.TUESDAY);
  message.react(Emojis.WEDNESDAY);
  message.react(Emojis.THURSDAY);
  message.react(Emojis.FRIDAY);
  message.react(Emojis.SATURDAY);
  message.react(Emojis.SUNDAY);
}

export function autovote(message) {
  message.react(Emojis.UPVOTE);
  message.react(Emojis.DOWNVOTE);
}

export function autopoll(message) {
  message.react(Emojis.AGREE);
  message.react(Emojis.DISAGREE);
  message.react(Emojis.QUESTIONMARK);
}

export function autorolepoll(message) {
  message.react(Emojis.MAINTANK);
  message.react(Emojis.OFFTANK);
  message.react(Emojis.HITSCAN);
  message.react(Emojis.PROJECTILE);
  message.react(Emojis.FLEXSUPPORT);
  message.react(Emojis.MAINSUPPORT);
}