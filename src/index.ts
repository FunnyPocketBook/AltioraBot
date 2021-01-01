import { Client } from "discord.js";
import * as Poll from "./components/poll.js";
import * as Config from "./components/config.js";
import * as Util from "./util/util.js";

let config = Config.loadConfig();

// Create an instance of a Discord client
const client = new Client();
const prefix = "^";

client.on("ready", () => {
  console.log("I am ready!");
});

// Create an event listener for messages
client.on("message", (message) => {
  if (message.content.startsWith(prefix) && !message.author.bot) {
    const wholeMessage = message.content.split("\n");
    const options = wholeMessage[0]
      .slice(prefix.length)
      .trim()
      .match(/"(?:\\"|[^"])+"|(\S)+/g); // Splits string by non-whitespace but keeps text in quotes together
    // Since the command needs to be in the first line of the message,
    // everything that follows the second line is the actual textcontent of the message
    const command = options?.shift().toLowerCase();
    if (!command) return;
    const args = Util.argumentParser(options, message);
    if (command.startsWith("auto")) {
      Poll.vote(message, command, args);
    } else if (command === "config") {
      // Get and set config
      console.log(`${message.id}: [Bot] ${message.author.username} trying to access config`);
      if (message.member.hasPermission("MANAGE_GUILD")) {
        if (args.list) {
          message.reply(`\`\`\`\n${Config.getConfigurableConfig()}\n\`\`\``);
        }
        if (args.set) {
          Config.setConfig(args.set);
          config = Config.loadConfig();
          message.reply(`The configuration has been updated to:\n\`\`\`\n${Config.getConfigurableConfig()}\n\`\`\``);
        }
      }
    }
  }
  // Check introductory channel for messages and give community role to member if they have written an intro longer than 5 words
  if (
    message.channel.id === config.options.introductionChannelId &&
    !message.author.bot &&
    message.content.split(" ").length >= config.options.minIntroWords
  ) {
    Util.addRoleIfNotExists(
      message,
      config.options.communityRoleId,
      `User introduced themselves with more than ${config.options.minIntroWords} words.`
    );
  }
});

client.login(config.botToken);

process.on("unhandledRejection", (error: Error, p) => {
  console.log("=== UNHANDLED REJECTION ===");
  console.dir(error.stack);
});
