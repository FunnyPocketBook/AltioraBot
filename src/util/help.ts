import { EMOJIS } from "../util/constants.js";
import { Message, MessageEmbed } from "discord.js";
import { Arguments } from "../types/interface.js";

export const Help = {
  commands: {
    usage: "Unless specified otherwise, every command has to start with a tiny mountain (caret) `^` and it has to be the first line of the message.",
    help: {
      name: "help",
      description: "Shows this help section.",
      usage: "`^help`",
      inline: false,
      options: {
        player: {
          name: "player",
          description: "Shows help of the `^player` command.",
          usage: "`^help -player`"
        },
        makevc: {
          name: "makevc",
          description: "Shows help of the `^makevc` command.",
          usage: "`^help -makevc`"
        },
        poll: {
          name: "poll",
          description: "Shows help of all the `^autovote`, `^autopoll` etc. commands.",
          usage: "`^help -poll`"
        },
        pollOptions: {
          name: "pollOptions",
          description: "Shows help of all the `^autovote`, `^autopoll` etc. options.",
          usage: "`^help -pollOptions`"
        }
      }
    },
    admin: {
      config: {
        name: "config",
        description: `Show and manipulate the config. Only accessible to members with "Manage Server" permission.`,
        inline: false,
        options: {
          list: {
            name: "list",
            description: "Lists the current configuration.",
            usage: "`^config -list`"
          },
          set: {
            name: "set",
            description: "Sets one or more keys of the configuration.",
            usage: "`^config -set <key> <value> [<key> <value>]`"
          }
        }
      }
    },
    player: {
      name: "player",
      description: `Gets the player info from the current competetive season from playoverwatch.com. It's kinda broken when no placements have been made or only one hero has been played but it will be fixed with the next update.`,
      usage: "`^player <battletag>`",
      inline: false
    },
    makevc: {
      name: "makevc",
      description: `Creates a temporary voice channel, accessible to everyone with the community role, that is deleted after everyone has left the voice channel or if the voice channel is empty 60 seconds after its creation.`,
      usage: "`^makevc <channelName>`",
      inline: false,
      options: {
        userlimit: {
          name: "userlimit",
          description: "Sets a user limit for the voice channel. Maximum value is 99.",
          usage: "`^makevc <channelName> -userlimit <limit>`"
        },
        permissions: {
          name: "permissions",
          description:
            "Sets the roles that may have access to the voice channel. Every other role is not permitted to see or join the voice channel. Multiple roles can be set and roles with a whitespace in the name have to be surrounded with double quotes.",
          usage: "`^makevc <channelName> -permissions <roleName>`"
        }
      }
    },
    poll: {
      description: "See `^help -pollOptions` for all options.",
      commands: {
        autovote: {
          name: "autovote",
          description: `Reacts with ${EMOJIS.UPVOTE} and ${EMOJIS.DOWNVOTE}.`,
          usage: "`^autovote [OPTIONS]` or `autovote`",
          inline: true
        },
        autopoll: {
          name: "autopoll",
          description: `Reacts with ${EMOJIS.AGREE}, ${EMOJIS.DISAGREE}, and ${EMOJIS.QUESTIONMARK}.`,
          usage: "`^autopoll [OPTIONS]` or `autopoll`",
          inline: true
        },
        autoschedule: {
          name: "autoschedule",
          description: `Reacts with ${EMOJIS.MONDAY}, ${EMOJIS.TUESDAY}, ${EMOJIS.WEDNESDAY}, ${EMOJIS.THURSDAY}, ${EMOJIS.FRIDAY}, ${EMOJIS.SATURDAY}, and ${EMOJIS.SUNDAY}.`,
          usage: "`^autoschedule [OPTIONS]` or `autoschedule`",
          inline: true
        },
        autorolepoll: {
          name: "autorolepoll",
          description: `Reacts with ${EMOJIS.MAINTANK}, ${EMOJIS.OFFTANK}, ${EMOJIS.HITSCAN}, ${EMOJIS.PROJECTILE}, ${EMOJIS.FLEXSUPPORT}, and ${EMOJIS.MAINSUPPORT}.`,
          usage: "`^autorolepoll [OPTIONS]` or `autorolepoll`",
          inline: true
        }
      },
      options: {
        description: "These are the options that can be used with any poll commands. See `^help -poll` for all commands.",
        timer: {
          name: "timer",
          description:
            "Sets a duration after which the poll ends and a message is sent with the result of the poll. The duration is in the format `2h30m5s`",
          usage: "`^autopoll -timer <duration>`"
        },
        reminder: {
          name: "reminder",
          description:
            "Sets one or more reminders. If it is used with `-timer`, the reminder duration specified is the time left until the poll closes, otherwise the reminder will be sent after the specified duration. The duration is in the format `2h30m5s`",
          usage: "`^autovote -reminder <duration> [<duration>]`"
        },
        ping: {
          name: "ping",
          description: "Sets one or more roles or members to ping.",
          usage: "`^autovote -ping <role>|<member> [<role>|<member>]`"
        },
        custom: {
          name: "custom",
          description:
            "Sets custom reactions and overrides the default ones. Each reaction is on its own line and the reaction emoji is the first character of the line. The reaction description is separated by a whitespace from the reaction.",
          usage: "```\n^autovote -custom\n<emoji> <description>\n[<emoji> <description>]\n```"
        },
        message: {
          name: "message",
          description:
            "Sets custom message for a poll result with a majority reaction, used in conjunction with `-timer`. `{result}` in the custom message can be used to show the majority reaction.",
          usage: '`^autovote -timer <duration> -message "{result} has won the poll."`'
        }
      }
    }
  }
};

export function help(message: Message, args: Arguments): void {
  const embedHelp = new MessageEmbed()
    .setTitle("**Help**")
    .setURL("https://github.com/FunnyPocketBook/AltioraBot")
    .setColor(1778203)
    .addField(`**^${Help.commands.help.name}**`, `${Help.commands.help.description}\n${Help.commands.help.usage}`);
  addOptionFields(embedHelp, Help.commands.help.options);
  const embedPollCommands = new MessageEmbed()
    .setTitle("**Poll Commands**")
    .setDescription(Help.commands.poll.description)
    .setURL("https://github.com/FunnyPocketBook/AltioraBot")
    .setColor(1778203);
  addCommandFields(embedPollCommands, Help.commands.poll.commands);
  const embedPollOptions = new MessageEmbed()
    .setTitle("**Poll Options**")
    .setDescription(Help.commands.poll.options.description)
    .setURL("https://github.com/FunnyPocketBook/AltioraBot")
    .setColor(1778203);
  addOptionFields(embedPollOptions, Help.commands.poll.options);
  const embedPlayerInfo = new MessageEmbed()
    .setTitle("**Player Info**")
    .setURL("https://github.com/FunnyPocketBook/AltioraBot")
    .setColor(1778203)
    .addField(`**^${Help.commands.player.name}**`, `${Help.commands.player.description}\n${Help.commands.player.usage}`);
  const embedMakevc = new MessageEmbed()
    .setTitle("**Create temporary VC**")
    .setURL("https://github.com/FunnyPocketBook/AltioraBot")
    .setColor(1778203)
    .addField(`**^${Help.commands.makevc.name}**`, `${Help.commands.makevc.description}\n${Help.commands.makevc.usage}`);
  addOptionFields(embedMakevc, Help.commands.makevc.options);

  for (const key of Object.keys(args)) {
    args[key] = true;
  }

  if (args.all) {
    message.reply(embedPollCommands);
    message.reply(embedPollOptions);
    message.reply(embedPlayerInfo);
    message.reply(embedMakevc);
  } else {
    if (args.poll) message.reply(embedPollCommands);
    if (args.pollOptions) message.reply(embedPollOptions);
    if (args.player) message.reply(embedPlayerInfo);
    if (args.makevc) message.reply(embedMakevc);
    if (Object.keys(args).length === 0 && args.constructor === Object) message.reply(embedHelp);
  }
}

function addOptionFields(embed: MessageEmbed, options) {
  for (const [key, val] of Object.entries(options)) {
    const name = `**-${key}**`;
    const value = `${(val as any).description}\n${(val as any).usage}`;
    embed.addField(name, value);
  }
}

function addCommandFields(embed: MessageEmbed, commands) {
  for (const [key, val] of Object.entries(commands)) {
    const name = `**^${key}**`;
    const value = `${(val as any).description}${
      (val as any).inline ? " This command can be used in the middle of a message without options and `^`" : ""
    }\n${(val as any).usage}`;
    embed.addField(name, value);
  }
}
