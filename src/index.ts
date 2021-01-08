import * as Discord from "discord.js";
import * as Poll from "./components/poll.js";
import { getPlayerInfo } from "./components/player.js";
import * as Config from "./components/config.js";
import * as Util from "./util/util.js";
import * as Channel from "./components/channel.js";
import * as Interfaces from "./types/interface.js";
import * as Const from "./util/constants.js";

let config = Config.loadConfig();

// Create an instance of a Discord client
const client = new Discord.Client();
const prefix = "^";

const tempVoiceChannels: [Discord.GuildChannel, Discord.GuildMember][] = [];

client.on("ready", () => {
  console.log("Beep boop bot be ready!");
});

// Create an event listener for messages
client.on("message", (message) => {
  if (message.content.startsWith(prefix) && !message.author.bot) {
    commandHandler(message);
  } else if (message.content.includes("autorole")) Poll.autoRolePoll(message);
  else if (message.content.includes("autopoll")) Poll.autoPoll(message);
  else if (message.content.includes("autovote")) Poll.autoVote(message);
  else if (message.content.includes("autoschedule")) Poll.autoSchedule(message);
  // Check introductory channel for messages and give community role to member if they have written an intro longer than 5 words
  if (
    message.channel.id === config.options.introductionChannelId &&
    !message.author.bot &&
    message.content.split(" ").length >= config.options.minIntroWords
  ) {
    Util.addRoleIfNotExists(
      message,
      config.options.communityRoleId,
      `User introduced themselves with more than ${config.options.minIntroWords} words.`,
      true
    );
  }
});

client.on("voiceStateUpdate", async (oldMember, newMember) => {
  for (let i = tempVoiceChannels.length - 1; i >= 0; i--) {
    const channel = tempVoiceChannels[i][0];
    if (oldMember.channel?.equals(channel) && channel.members.size === 0) {
      try {
        await channel.delete();
        console.log(`[Channel] ${channel.name} has been deleted.`);
        tempVoiceChannels.splice(i, 1);
      } catch (e) {
        tempVoiceChannels.splice(i, 1);
      }
    }
  }
});

client.on("guildMemberUpdate", (oldMember, newMember) => {
  sendWelcomeMessage(oldMember, newMember);
});

client.login(config.botToken);

async function commandHandler(message: Discord.Message) {
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
    configureConfig(message, args);
  } else if (command === "player") {
    // Get player info from playoverwatch.com
    const playerInfo = await getPlayerInfo(options[0]);
    if (playerInfo.error) message.reply(playerInfo.error);
    else message.reply(`**${playerInfo.name}**\n${playerInfo.sr.text}\nMost played heroes: ${playerInfo.topHeroes.join(", ")}`);
  } else if (command === "makevc") {
    // Create temporary voice channel
    makeVc(options, args, message);
  }
}

async function sendWelcomeMessage(oldMember: Discord.GuildMember | Discord.PartialGuildMember, newMember: Discord.GuildMember) {
  const roleDifference = oldMember.roles.cache.difference(newMember.roles.cache);
  for (const role of roleDifference) {
    const roleId = role[1].id;
    if (newMember.roles.cache.has(roleId)) {
      // Find team name and gaming channel from role ID
      let teamName, gamingName;
      const teamElement = Object.entries(Const.ROLES.TEAMS.TRYOUTS).find((r) => r[1] === roleId);
      const gamingElement = Object.entries(Const.ROLES.ALTIORA.GAMING).find((r) => r[1] === roleId);
      if (teamElement) {
        teamName = teamElement[0];
      } else if (gamingElement) {
        gamingName = gamingElement[0];
      }

      if (teamName) {
        // Tryouts role
        const channel = client.channels.cache.get(Const.CHANNELS.TEAMS[teamName].TRYOUTS);
        teamName = Const.CHANNELS.TEAMS[teamName].NAME;
        const welcomeMessage = config.options.tryoutsWelcomeMsg.replace(/\{member\}/g, newMember.toString()).replace(/\{teamName\}/g, teamName);
        const message = await (channel as Discord.TextChannel).send(welcomeMessage);
        console.log(`${message.id}: [Role] ${welcomeMessage}`);
      } else if (roleId === Const.ROLES.ALTIORA.ALTIORA) {
        // Altiora role
        const channel = client.channels.cache.get(Const.CHANNELS.ALTIORA.FRIENDS_CHAT);
        const altioraRoleMenu = client.channels.cache.get(Const.CHANNELS.ALTIORA.ALTIORA_ROLE_MENU);
        const welcomeMessage = config.options.altioraWelcomeMsg
          .replace(/\{member\}/g, newMember.toString())
          .replace(/\{altioraRoleMenu\}/g, altioraRoleMenu.toString());
        const message = await (channel as Discord.TextChannel).send(welcomeMessage);
        console.log(`${message.id}: [Role] ${welcomeMessage}`);
      } else if (roleId === config.options.communityRoleId) {
        // Community role
        const channel = client.channels.cache.get(Const.CHANNELS.COMMUNITY.GUEST_CHAT);
        const roleMenu = client.channels.cache.get(Const.CHANNELS.COMMUNITY.ROLE_MENU);
        const welcomeMessage = config.options.communityWelcomeMsg
          .replace(/\{member\}/g, newMember.toString())
          .replace(/\{roleMenu\}/g, roleMenu.toString());
        const message = await (channel as Discord.TextChannel).send(welcomeMessage);
        console.log(`${message.id}: [Role] ${welcomeMessage}`);
      } else if (roleId === Const.ROLES.ALTIORA.MINECRAFT) {
        // Minecraft role
        const channel = client.channels.cache.get(Const.CHANNELS.ALTIORA.MINECRAFT);
        const welcomeMessage = config.options.minecraftWelcomeMsg.replace(/\{member\}/g, newMember.toString());
        const message = await (channel as Discord.TextChannel).send(welcomeMessage);
        console.log(`${message.id}: [Role] ${welcomeMessage}`);
      } else if (gamingName) {
        // Generic gaming role
        const channel = client.channels.cache.get(Const.CHANNELS.ALTIORA.GAMING[gamingName]);
        const welcomeMessage = config.options.gamingWelcomeMsg.replace(/\{member\}/g, newMember.toString());
        const message = await (channel as Discord.TextChannel).send(welcomeMessage);
        console.log(`${message.id}: [Role] ${welcomeMessage}`);
      }
    }
  }
}

function configureConfig(message: Discord.Message, args: Interfaces.Arguments) {
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

async function makeVc(options: Iterable<string>, args: Interfaces.Arguments, message: Discord.Message) {
  const category = message.guild.channels.cache.get(config.options.tempVCCategoryId);
  const name = options[0].replace(/(^")|("$)/g, "");
  if (parseInt(args.userlimit) > 99) {
    message.reply("The user limit for a voice channel cannot exceed 99. Consider omitting `-userlimit` to not set a user limit.");
    return;
  }
  const channelOptions: Discord.GuildCreateChannelOptions = {
    type: "voice",
    parent: category,
    userLimit: args.userlimit ? parseInt(args.userlimit) : 0
  };
  const newChannel = await Channel.createVoiceChannel(message, name, channelOptions, tempVoiceChannels);
  if (newChannel) {
    tempVoiceChannels.push(newChannel);
    setTimeout(async () => {
      if (newChannel[0].members.size === 0) {
        try {
          await newChannel[0].delete();
          const index = tempVoiceChannels.findIndex((e) => e[0].id === newChannel[0].id);
          tempVoiceChannels.splice(index, 1);
          console.log(`[Channel] ${newChannel[0].name} has been deleted because of inactivity.`);
        } catch (e) {
          console.log(`[Channel] ${newChannel[0].name} has already been deleted.`);
        }
      }
    }, config.options.tempVCIdleTime * 1000);
  }
}

process.on("unhandledRejection", (error: Error) => {
  console.log("=== UNHANDLED REJECTION ===");
  console.dir(error.stack);
});
