import * as Interfaces from "../types/poll.interface";
import * as Discord from "discord.js";

export function humanTimeToSeconds(time: string): number {
  let seconds = 0;
  const splitTime = time.match(/\d+[hms]/g);
  if (splitTime === null) return -1;
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

export function argumentParser(args: string[]) {
  const sortedArguments: Interfaces.Arguments = {};
  let option = "";
  for (const arg of args) {
    if (arg.startsWith("-")) {
      option = arg.slice(1);
      sortedArguments[option] = [];
      continue;
    }
    if (option !== "") {
      sortedArguments[option].push(arg);
    }
  }
  return sortedArguments;
}
