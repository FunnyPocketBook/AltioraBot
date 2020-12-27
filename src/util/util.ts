import * as Interfaces from "../types/interface";
import { Message } from "discord.js";

export function humanTimeToSeconds(time: string): number {
  if (!time) return -1;
  let seconds = 0;
  const splitTime = time.match(/\d+[hms]/g);
  if (splitTime === null) return -2;
  for (const t of splitTime) {
    const type = t.slice(-1);
    const number = parseInt(t.slice(0, -1));
    switch (type) {
      case "h":
        seconds += number * 60 * 60;
        break;
      case "m":
        seconds += number * 60;
        break;
      case "s":
        seconds += number;
        break;
    }
  }
  return seconds;
}

export function argumentParser(args: string[], message?: Message): Interfaces.Arguments {
  const sortedArguments: Interfaces.Arguments = {};
  let option = "";
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    // If the argument starts with "-" then it's a flag. Else it's an argument for that flag
    if (arg.startsWith("-")) {
      option = arg.slice(1);
      if (option === "custom") sortedArguments[option] = getEmojiAndDescription(message);
      else if (option === "message") {
        const customMessage = args[++i];
        sortedArguments[option] = customMessage.substring(1, customMessage.length - 1);
      } else if (option === "set") {
        sortedArguments.set = new Map();
        do {
          const key = args[++i];
          const value = args[++i];
          sortedArguments.set.set(key, value.substring(1, value.length - 1));
        } while (i + 1 < args.length && !args[i + 1].startsWith("-"));
      } else sortedArguments[option] = [];
      continue;
    } else if (option !== "") sortedArguments[option].push(arg);
  }
  return sortedArguments;
}

export function addRoleIfNotExists(message: Message, roleId: string, reason?: string): void {
  const member = message.member;
  const hasRole = member.roles.cache.some((role) => role.id === roleId);
  if (!hasRole) {
    console.log(`${message.id}: [Mod] ${member.displayName} has been assigned the role ${roleId} with reason ${reason}.`);
    member.roles.add(roleId, reason);
  }
}

// The emoji and its description are in the form "<:emojiname:emojiID> description of this emoji/option"
function getEmojiAndDescription(message: Message): Map<string, string> {
  const text = message.content.split("\n");
  const reactions = new Map();
  for (const line of text) {
    if (!line.startsWith("<:") && line.substring(0, 2).charCodeAt(0) < 161) continue;
    let emoji = line.substr(0, line.indexOf(" "));
    let description = line.substr(line.indexOf(" ") + 1);
    emoji = emoji.trim() === "" ? description : emoji;
    description = description.trim() === "" ? emoji : description;
    reactions.set(emoji, description);
  }
  return reactions;
}
