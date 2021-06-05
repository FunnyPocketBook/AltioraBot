import * as Discord from "discord.js";

import * as Channel from "./components/channel.js";
import * as CustomRoles from "./components/ringer.js";
import * as Role from "./components/role.js";
import * as Interfaces from "./types/interface.js";
import * as Poll from "./components/poll.js";
import * as Welcome from "./components/welcome.js";
import { getPlayerInfo } from "./components/player.js";
import * as Config from "./components/config.js";

import * as CONST from "./util/constants.js";
import { help } from "./util/help.js";
import * as Util from "./util/util.js";

let config = Config.loadConfig();

const clientOptions = {
  intents: new Discord.Intents([
    "GUILDS",
    "GUILD_MEMBERS",
    "GUILD_BANS",
    "GUILD_EMOJIS",
    "GUILD_INTEGRATIONS",
    "GUILD_WEBHOOKS",
    "GUILD_INVITES",
    "GUILD_VOICE_STATES",
    "GUILD_PRESENCES",
    "GUILD_MESSAGES",
    "GUILD_MESSAGE_REACTIONS",
    "GUILD_MESSAGE_TYPING",
    "DIRECT_MESSAGES",
    "DIRECT_MESSAGE_REACTIONS",
    "DIRECT_MESSAGE_TYPING"
  ])
};
const client = new Discord.Client(clientOptions);
const prefix = "^";

const tempVoiceChannels: [Discord.GuildChannel, Discord.GuildMember][] = [];

client.on("ready", () => {
  console.log("Beep boop bot be ready!");
});

// Create an event listener for messages
client.on("message", (message) => {
  if (message.guild.id === CONST.ALTIORA_GUILD_ID) {
    if (!message.author.bot) {
      if (message.content.startsWith(prefix)) {
        commandHandler(message);
      } else if (message.content.toLowerCase().includes("autorole")) Poll.autoRolePoll(message);
      else if (message.content.toLowerCase().includes("autopoll")) Poll.autoPoll(message);
      else if (message.content.toLowerCase().includes("autovote")) Poll.autoVote(message);
      else if (message.content.toLowerCase().includes("autoschedule")) Poll.autoSchedule(message);
      else if (message.author.id === "490993140837253120") {
        if (Math.floor(Math.random() * 10) == 1) {
          const [britified, changed] = Util.britishify(message);
          if (changed) {
            message.reply(britified);
            console.log(`${message.id}: [Joke] ${britified}`);
          }
        }
      }
      if (message.channel.id === config.options.introductionChannelId && message.content.split(" ").length >= config.options.minIntroWords) {
        // Check introductory channel for messages and give community role to member if they have written an intro longer than 5 words
        Util.addRoleIfNotExists(
          message,
          config.options.communityRoleId,
          `User introduced themselves with more than ${config.options.minIntroWords} words.`,
          true
        );
      }
    }
  }
});

client.on("voiceStateUpdate", async (oldMember) => {
  if (oldMember.guild.id === CONST.ALTIORA_GUILD_ID) {
    for (let i = tempVoiceChannels.length - 1; i >= 0; i--) {
      const channel = tempVoiceChannels[i][0];
      if (oldMember.channel?.equals(channel) && channel.members.size === 0) {
        try {
          await channel.delete();
          console.log(`[Channel] ${channel.name} has been deleted.`);
          tempVoiceChannels.splice(i, 1);
        } catch (e) {
          tempVoiceChannels.splice(i, 1);
          console.log(e);
        }
      }
    }
  }
});

client.on("guildMemberUpdate", (oldMember, newMember) => {
  if (oldMember.guild.id === CONST.ALTIORA_GUILD_ID) {
    Welcome.sendWelcomeMessage(client, config, oldMember, newMember);
  }
});

client.on("guildMemberAdd", async (member) => {
  if (member.guild.id === CONST.ALTIORA_GUILD_ID) {
    // Community role
    const channel = client.channels.cache.get(CONST.CHANNELS.COMMUNITY.GUEST_CHAT);
    const roleMenu = client.channels.cache.get(CONST.CHANNELS.COMMUNITY.ROLE_MENU);
    const welcomeMessage = config.options.communityWelcomeMsg.replace(/\{member\}/g, member.toString()).replace(/\{roleMenu\}/g, roleMenu.toString());
    const message = await (channel as Discord.TextChannel).send(welcomeMessage);
    console.log(`${message.id}: [Role] ${welcomeMessage}`);
  }
});

client.on("channelDelete", (deletedChannel) => {
  for (let i = tempVoiceChannels.length - 1; i >= 0; i--) {
    const channel = tempVoiceChannels[i][0];
    if (deletedChannel.id === channel.id) {
      tempVoiceChannels.splice(i, 1);
    }
  }
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
  } else if (command === "makevc") makeVc(options, args, message);
  else if (command === "help") help(message, args);
  else if (command === "ringer" || command === "lfr") {
    if (message.channel.id === CONST.CHANNELS.LOST_AND_FOUND.ALTIORA_RINGERS || message.channel.id === CONST.CHANNELS.SERVER_MAKING.BOT_TEST)
      CustomRoles.customRinger(message, options, command);
  } else if (command === "find") CustomRoles.customRinger(message, options, command);
  else if (command === "role") Role.enroll(message, options);
  else if (command === "derole") Role.derole(message, options);
}

function configureConfig(message: Discord.Message, args: Interfaces.Arguments) {
  console.log(`${message.id}: [Bot] ${message.author.username} trying to access config`);
  if (message.member.permissions.has("MANAGE_CHANNELS")) {
    if (args.list) {
      message.reply(`\`\`\`JSON\n${Config.getConfigurableConfig()}\n\`\`\``);
    }
    if (args.set) {
      Config.setConfig(args.set);
      config = Config.loadConfig();
      message.reply(`The configuration has been updated to:\n\`\`\`JSON\n${Config.getConfigurableConfig()}\n\`\`\``);
    }
  }
}

// TODO: Move to separate file
async function makeVc(options: Iterable<string>, args: Interfaces.Arguments, message: Discord.Message) {
  const category = message.guild.channels.cache.get(config.options.tempVCCategoryId);
  if (!options[0]) {
    message.reply("Please provide a name for the voice channel. `^makevc channelName`");
    return;
  }
  const name = options[0].replace(/(^")|("$)/g, "");
  const everyone = message.guild.roles.everyone.id;
  const permissions: Discord.OverwriteResolvable[] = [
    {
      id: everyone,
      deny: ["VIEW_CHANNEL", "CONNECT", "MANAGE_CHANNELS"]
    },
    {
      id: message.member.id,
      allow: ["VIEW_CHANNEL", "CONNECT", "MANAGE_CHANNELS"]
    },
    {
      id: CONST.ROLES.STAFF.MODERATOR,
      allow: ["VIEW_CHANNEL", "CONNECT", "MANAGE_CHANNELS"]
    },
    {
      id: CONST.ROLES.STAFF.OPERATIONS_STAFF,
      allow: ["VIEW_CHANNEL", "CONNECT", "MANAGE_CHANNELS"]
    },
    {
      id: client.user.id,
      allow: ["VIEW_CHANNEL", "CONNECT", "MANAGE_CHANNELS"]
    }
  ];
  if (!args.permissions) {
    permissions.push({
      id: config.options.communityRoleId,
      allow: ["VIEW_CHANNEL", "CONNECT"]
    });
  } else {
    const invalidRoles = [];
    for (const roleName of args.permissions) {
      const roleId = Util.getRoleIdFromName(Util.removeDoubleQuotes(roleName), message.guild.roles.cache);
      if (roleId !== "") {
        permissions.push({
          id: roleId,
          allow: ["VIEW_CHANNEL", "CONNECT"]
        });
      } else {
        invalidRoles.push(roleName);
      }
    }
    if (invalidRoles.length > 0) {
      message.reply(
        `The roles \`${invalidRoles.join(
          ", "
        )}\` are invalid. Please check again if the role names are correct. Roles with a whitespace have to be surrounded in double quotes, for example \`"Altiora Invitational"\`.`
      );
      return;
    }
  }

  if (parseInt(args.userlimit) > 99) {
    message.reply("The user limit for a voice channel cannot exceed 99. Consider omitting `-userlimit` to not set a user limit.");
    return;
  } else if (parseInt(args.userlimit) === 1) {
    message.reply(`No ego channels allowed! ${CONST.EMOJIS.BLOBKNIFE}`);
    return;
  } else if (parseInt(args.userlimit) < 1) {
    message.reply(`Please set a number between 2 and 99! ${CONST.EMOJIS.BLOBKNIFE}`);
    return;
  }
  const channelOptions: Discord.GuildCreateChannelOptions = {
    type: "voice",
    parent: category,
    userLimit: args.userlimit ? parseInt(args.userlimit) : 0,
    permissionOverwrites: permissions
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
        } catch {
          console.log(`[Channel] ${newChannel[0].name} has already been deleted.`);
        }
      }
    }, config.options.tempVCIdleTime * 1000);
  }
}

process.on("unhandledRejection", (error: Error) => {
  console.log(new Date().toISOString());
  console.log("=== UNHANDLED REJECTION ===");
  console.dir(error.stack);
});
