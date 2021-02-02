import { Message, Collection, Role, GuildMember, TextChannel } from "discord.js";
import * as Util from "../util/util.js";
import * as CONST from "../util/constants.js";

export async function customRinger(message: Message, options: string[]): Promise<void> {
  const roles = new Collection<string, Role>();
  const pingMembers = new Collection<string, GuildMember>();
  const randomString = Math.random().toString(36).substring(7);
  const tempRole = await message.guild.roles.create({
    data: {
      name: `Temp Ringer Role ${randomString}`,
      mentionable: true
    }
  });
  let region = false;
  let rank = false;
  let role = false;
  for (let option of options) {
    option = Util.removeDoubleQuotes(option.toLowerCase());
    // This can surely be done smarter but at 04:34 I'm not smart
    if (option === "na" || option === "na ringer" || option === "na ringers" || option === "nar") {
      roles.set(CONST.ROLES.COMMUNITY.NA_RINGER, null);
      region = true;
    } else if (option === "eu" || option === "eu ringer" || option === "eu ringers" || option === "eur") {
      roles.set(CONST.ROLES.COMMUNITY.EU_RINGER, null);
      region = true;
    } else if (option === "tank") {
      roles.set(CONST.ROLES.COMMUNITY.ROLES.MAIN_TANK, null);
      roles.set(CONST.ROLES.COMMUNITY.ROLES.OFF_TANK, null);
      role = true;
    } else if (option === "mt" || option === "main tank" || option === "maintank") {
      roles.set(CONST.ROLES.COMMUNITY.ROLES.MAIN_TANK, null);
      role = true;
    } else if (option === "ot" || option === "off tank" || option === "offtank") {
      roles.set(CONST.ROLES.COMMUNITY.ROLES.OFF_TANK, null);
      role = true;
    } else if (option === "dps") {
      roles.set(CONST.ROLES.COMMUNITY.ROLES.HITSCAN_DPS, null);
      roles.set(CONST.ROLES.COMMUNITY.ROLES.PROJECTILE_DPS, null);
      role = true;
    } else if (option === "hs" || option === "hitscan" || option === "hsdps" || option === "hitscan dps" || option === "hdps") {
      roles.set(CONST.ROLES.COMMUNITY.ROLES.HITSCAN_DPS, null);
      role = true;
    } else if (
      option === "proj" ||
      option === "projectile" ||
      option === "projectile dps" ||
      option === "proj dps" ||
      option === "flex dps" ||
      option === "fdps"
    ) {
      roles.set(CONST.ROLES.COMMUNITY.ROLES.PROJECTILE_DPS, null);
      role = true;
    } else if (option === "support") {
      roles.set(CONST.ROLES.COMMUNITY.ROLES.FLEX_SUPPORT, null);
      roles.set(CONST.ROLES.COMMUNITY.ROLES.MAIN_SUPPORT, null);
      role = true;
    } else if (option === "fs" || option === "flexsupport" || option === "flex support") {
      roles.set(CONST.ROLES.COMMUNITY.ROLES.FLEX_SUPPORT, null);
      role = true;
    } else if (option === "ms" || option === "mainsupport" || option === "main support") {
      roles.set(CONST.ROLES.COMMUNITY.ROLES.MAIN_SUPPORT, null);
      role = true;
    } else if (option === "bronze") {
      roles.set(CONST.ROLES.COMMUNITY.RANKS.BRONZE, null);
      rank = true;
    } else if (option === "silver") {
      roles.set(CONST.ROLES.COMMUNITY.RANKS.SILVER, null);
      rank = true;
    } else if (option === "gold") {
      roles.set(CONST.ROLES.COMMUNITY.RANKS.GOLD, null);
      rank = true;
    } else if (option === "plat" || option === "platinum") {
      roles.set(CONST.ROLES.COMMUNITY.RANKS.PLATINUM, null);
      rank = true;
    } else if (option === "diamond" || option === "dia") {
      roles.set(CONST.ROLES.COMMUNITY.RANKS.DIAMOND, null);
      rank = true;
    } else if (option === "masters") {
      roles.set(CONST.ROLES.COMMUNITY.RANKS.MASTERS, null);
      rank = true;
    } else if (option === "gm" || option === "grandmaster" || option === "grand master") {
      roles.set(CONST.ROLES.COMMUNITY.RANKS.GM, null);
      rank = true;
    }
  }
  if (region && rank && role) {
    for (const [id, guildMember] of message.guild.members.cache) {
      const existingRoles = guildMember.roles.cache.intersect(roles);
      if (existingRoles.size === roles.size) {
        pingMembers.set(id, guildMember);
        await guildMember.roles.add(tempRole);
      }
    }
    await message.reply(`${tempRole}\nPinged ${pingMembers.size} members`);
  } else {
    message.reply("Please provide a region, rank and role.");
  }
  try {
    await tempRole.delete();
  } catch (e) {
    console.error(e);
    (message.guild.channels.cache.get(CONST.CHANNELS.STAFF.OPERATIONS) as TextChannel).send(
      `Something went wrong deleting the temporary ringer role ${tempRole.name}, please remove it manually.`
    );
  }
}
