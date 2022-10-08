import * as Const from "../util/constants.js";
import * as Util from "../util/util.js";
import { Message, MessageReaction, User } from "discord.js";
import * as Config from "./config.js";
import { Arguments } from "../types/interface.js";

export function vote(message: Message, command: string, args: Arguments): Promise<void> {
  if (args.timer) {
    const seconds = Util.humanTimeToSeconds(args.timer[0]);
    switch (seconds) {
      case -1:
        message.reply("Please provide a duration for `-timer`.");
        return;
      case -2:
        message.reply(
          "Please check the duration for `-timer`. It has to be a number followed by `h`, `m` or `s` or a combination of it, like `1h3m4s` or `2m9s`."
        );
        return;
    }
    timer(message, args, seconds);
  }
  if (args.reminder) {
    if (args.reminder.length === 0) {
      message.reply("Please provide a duration for `-reminder`.");
      return;
    }
    reminder(message, args);
  }
  if (!args.custom) {
    switch (command) {
      case "autorole":
        autoRolePoll(message);
        break;
      case "autopoll":
        autoPoll(message);
        break;
      case "autovote":
        autoVote(message);
        break;
      case "autoschedule":
        autoSchedule(message);
        break;
    }
  } else {
    customReactions(message, args);
  }
}

export async function autoSchedule(message: Message): Promise<void> {
  await message.react(Const.EMOJIS.MONDAY);
  await message.react(Const.EMOJIS.TUESDAY);
  await message.react(Const.EMOJIS.WEDNESDAY);
  await message.react(Const.EMOJIS.THURSDAY);
  await message.react(Const.EMOJIS.FRIDAY);
  await message.react(Const.EMOJIS.SATURDAY);
  message.react(Const.EMOJIS.SUNDAY);
}

export async function autoVote(message: Message): Promise<void> {
  await message.react(Const.EMOJIS.UPVOTE);
  message.react(Const.EMOJIS.DOWNVOTE);
}

export async function autoPoll(message: Message): Promise<void> {
  await message.react(Const.EMOJIS.UPVOTE);
  await message.react(Const.EMOJIS.DOWNVOTE);
  message.react(Const.EMOJIS.QUESTIONMARK);
}

export async function autoRolePoll(message: Message): Promise<void> {
  await message.react(Const.EMOJIS.MAINTANK);
  await message.react(Const.EMOJIS.OFFTANK);
  await message.react(Const.EMOJIS.HITSCAN);
  await message.react(Const.EMOJIS.PROJECTILE);
  await message.react(Const.EMOJIS.FLEXSUPPORT);
  message.react(Const.EMOJIS.MAINSUPPORT);
}

async function customReactions(message: Message, args: Arguments): Promise<void> {
  for (const emoji of args.custom.keys()) {
    await message.react(emoji);
  }
}

async function timer(message: Message, args: Arguments, seconds: number): Promise<void> {
  const filter = (_reaction: MessageReaction, user: User) => !user.bot; // Only get the reactions that aren't by bots
  const options = {
    time: seconds * 1000
  };
  console.log(`${message.id}: [Poll] Wait for ${seconds} to end the poll.\n${message.content}`);
  const reactions = await message.awaitReactions(filter, options);
  const config = Config.loadConfig();
  let max = 0;
  const allReactions = {}; // Stores which user reacted with which emoji - maybe make it a map? TBD
  let maxReaction = [];
  // Get maximum reaction count
  for (const reaction of reactions) {
    const count = reaction[1].count;
    const user = reaction[1].users.fetch();
    allReactions[reaction[0]] = {
      reaction: reaction[1],
      users: await user
    };
    if (count > max) max = count;
  }
  // Get the reactions with maximum count
  for (const reaction of reactions) {
    if (max === reaction[1].count) maxReaction.push(reaction[1].emoji);
  }
  // If custom options are given, convert the emojis to the corresponding option
  if (args.custom) {
    maxReaction = maxReaction.map((r) => {
      const option = args.custom.get(r.toString());
      if (option === undefined) return r;
      else return option;
    });
  }
  // Bot reactions don't count
  if (maxReaction.length === 0) {
    // No reactions
    console.log(`${message.id}: [Poll] No reactions`);
    message.reply(`${args.ping ? args.ping.join(", ") : ""} ${config.options.noReactionText}`);
  } else if (maxReaction.length > 1) {
    // Tie between multiple choices
    console.log(`${message.id}: [Poll] Tie between ${maxReaction.join(", ")}`);
    message.reply(`${args.ping ? args.ping.join(", ") : ""} ${config.options.tieText}: ${maxReaction.join(", ")}`);
  } else {
    if (args.message) {
      // Custom message provided
      console.log(`${message.id}: [Poll] Custom message provided: ${args.message}`);
      message.reply(`${args.ping ? args.ping.join(", ") : ""} ${args.message.replace(/\{result\}/g, maxReaction.join(", "))}`);
    } else {
      message.reply(`${args.ping ? args.ping.join(", ") : ""} ${config.options.majorityText}: ${maxReaction}`);
    }
  }
}

/**
 * Reminds any potential roles/members to vote for a message again.
 * @param message Discord message to reply to
 * @param args Arguments for the reminder times and to determine whether or not to ping anyone
 */
function reminder(message: Message, args: Arguments): void {
  let pollEndSeconds = null;
  // Poll has an end
  if (args.timer) {
    pollEndSeconds = Util.humanTimeToSeconds(args.timer[0]);
    console.log(`${message.id}: [Poll] Vote ends in ${new Date(pollEndSeconds * 1000).toISOString().substr(11, 8)}\n${message.content}`);
  }
  for (const reminder of args.reminder) {
    const reminderSeconds = Util.humanTimeToSeconds(reminder);
    if (reminderSeconds === -1) {
      message.reply("Please provide a duration for `-reminder`.");
      continue;
    } else if (reminderSeconds === -2) {
      message.reply(
        "Please check the duration for `-reminder`. It has to be a number followed by `h`, `m` or `s` or a combination of it, like `1h3m4s` or `2m9s`."
      );
      continue;
    }
    let timeoutSeconds = 0;
    let text = "";
    // If the poll has an end, say how much time is left. Otherwise simple reminder
    if (pollEndSeconds === null) {
      text = "Reminder of the vote!";
      timeoutSeconds = reminderSeconds;
    } else {
      text = `The vote is closing in ${new Date(reminderSeconds * 1000).toISOString().substr(11, 8)}`;
      timeoutSeconds = pollEndSeconds - reminderSeconds;
    }
    // For each setTimeout create a self invoking function to store the intermediate variable values.
    // Otherwise the values of the last iteration will be used for each setTimeout
    setTimeout(
      (function (text, ping) {
        return function () {
          console.log(`${message.id}: [Poll] Sending reminder`);
          message.reply(`${ping ? ping.join(", ") : ""} ${text}`);
        };
      })(text, args.ping),
      timeoutSeconds * 1000
    );
  }
}
