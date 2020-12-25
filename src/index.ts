import * as Discord from "discord.js";
import * as Poll from "./components/poll.js";
import * as Config from "./components/config.js";
import * as Util from "./util/util.js";

let config = Config.loadConfig();

// Create an instance of a Discord client
const client = new Discord.Client();
const prefix = "^";

client.on("ready", () => {
  console.log("I am ready!");
});

// Create an event listener for messages
client.on("message", (message) => {
  if (message.content.startsWith(prefix) || !message.author.bot) {
    const wholeMessage = message.content.split("\n");
    const options = wholeMessage[0].slice(prefix.length).trim().split(/\s+/);
    // Since the command needs to be in the first line of the message,
    // everything that follows the second line is the actual textcontent of the message
    const command = options.shift().toLowerCase();
    const args = Util.argumentParser(options);
    if (command === "autoschedule") {
      Poll.autoSchedule(message, args);
    }
    if (command === "autovote") {
      Poll.autoVote(message, args);
    }
    if (command === "autopoll") {
      Poll.autoPoll(message, args);
    }
    if (command === "autorolepoll") {
      Poll.autoRolePoll(message, args);
    }
    if (command === "config") {
      if (message.member.hasPermission("MANAGE_GUILD")) {
        if (args.list) {
          message.reply(`\`\`\`\n${Config.getConfig()}\n\`\`\``);
        }
        if (args.set) {
          Config.setConfig(args.set);
          config = Config.loadConfig();
          message.reply(`The configuration has been updated to:\n\`\`\`\n${Config.getConfig()}\n\`\`\``);
        }
      }
    }
  }
  // Check introductory channel for messages and give community role to member if they have written an intro longer than 5 words
  if (
    message.channel.id === config.options.introductionChannelId &&
    !message.author.bot &&
    message.content.split(" ").length > config.options.minIntroWords
  ) {
    addRoleIfNotExists(
      message,
      config.options.communityRoleId,
      `User introduced themselves with more than ${config.options.minIntroWords} words.`
    );
  }
});

client.login(config.botToken);

function addRoleIfNotExists(message: Discord.Message, roleId: string, reason?: string): void {
  const member = message.member;
  const hasRole = member.roles.cache.some((role) => role.id === roleId);
  if (!hasRole) {
    member.roles.add(roleId, reason);
  }
}
