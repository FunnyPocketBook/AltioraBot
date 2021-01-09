import { EMOJIS } from "../util/constants.js";

export const Help = {
  commands: {
    usage: "Unless specified otherwise, every command has to start with a tiny mountain (caret) `^` and it has to be the first line of the message.",
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
            usage: "`^config -set key value [key value]`"
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
    poll: {
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
          description: `Reacts with ${EMOJIS.MAINTANK}, ${EMOJIS.OFFTANK}, ${EMOJIS.HITSCAN}, ${EMOJIS.PROJECTILE}, ${EMOJIS.FLEXSUPPORT}, and${EMOJIS.MAINSUPPORT}.`,
          usage: "`^autorolepoll [OPTIONS]` or `autorolepoll`",
          inline: true
        }
      },
      options: {
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
            "Sets custom reactions. Each reaction is on its own line and the reaction emoji is the first character of the line. The reaction description is separated by a whitespace from the reaction.",
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
