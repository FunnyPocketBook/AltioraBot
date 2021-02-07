import { Message, Collection, Role, GuildMember, TextChannel } from "discord.js";
import * as Util from "../util/util.js";
import * as CONST from "../util/constants.js";

const roleOptions = {
  region: {
    na: ["na", "na ringer", "na ringers", "nar"],
    eu: ["eu", "eu ringer", "eu ringers", "eur"]
  },
  role: {
    main_tank: ["mt", "main tank", "maintank"],
    off_tank: ["ot", "off tank", "offtank"],
    hitscan: ["hs", "hitscan", "hsdps", "hitscan dps", "hdps"],
    projectile: ["proj", "projectile", "projectile dps", "proj dps", "flex dps", "fdps"],
    flex_support: ["fs", "flexsupport", "flex support"],
    main_support: ["ms", "mainsupport", "main support"]
  },
  rank: {
    bronze: ["bronze"],
    silver: ["silver"],
    gold: ["gold"],
    platinum: ["platinum", "plat"],
    diamond: ["diamond", "dia"],
    masters: ["masters"],
    grandmaster: ["gm", "grandmaster", "grand master"]
  }
};

export async function customRinger(message: Message, options: string[], command: string): Promise<void> {
  const roles = {
    region: new Collection<string, Role>(),
    role: new Collection<string, Role>(),
    rank: new Collection<string, Role>()
  };
  const pingMembers = new Collection<string, GuildMember>();
  const randomString = Math.random().toString(36).substring(7);
  const createRole = message.guild.roles.create({
    name: `Temp Ringer Role ${randomString}`,
    mentionable: true
  });
  // TODO: loop through the options and dynamically assign the roles
  // Apparently I'm smarter at 2:50 with Lunare <3
  for (let option of options) {
    option = Util.removeDoubleQuotes(option.toLowerCase());
    // This can surely be done smarter but at 04:34 I'm not smart
    if (roleOptions.region.na.includes(option)) {
      // NA
      roles.region.set(CONST.ROLES.COMMUNITY.NA_RINGER, null);
    } else if (roleOptions.region.eu.includes(option)) {
      // EU
      roles.region.set(CONST.ROLES.COMMUNITY.EU_RINGER, null);
    } else if (option === "tank") {
      // Tank
      roles.role.set(CONST.ROLES.COMMUNITY.ROLES.MAIN_TANK, null);
      roles.role.set(CONST.ROLES.COMMUNITY.ROLES.OFF_TANK, null);
    } else if (roleOptions.role.main_tank.includes(option)) {
      // Main Tank
      roles.role.set(CONST.ROLES.COMMUNITY.ROLES.MAIN_TANK, null);
    } else if (roleOptions.role.off_tank.includes(option)) {
      // Off Tank
      roles.role.set(CONST.ROLES.COMMUNITY.ROLES.OFF_TANK, null);
    } else if (option === "dps") {
      // DPS
      roles.role.set(CONST.ROLES.COMMUNITY.ROLES.HITSCAN_DPS, null);
      roles.role.set(CONST.ROLES.COMMUNITY.ROLES.PROJECTILE_DPS, null);
    } else if (roleOptions.role.hitscan.includes(option)) {
      // Hitscan
      roles.role.set(CONST.ROLES.COMMUNITY.ROLES.HITSCAN_DPS, null);
    } else if (roleOptions.role.projectile.includes(option)) {
      // Projectile
      roles.role.set(CONST.ROLES.COMMUNITY.ROLES.PROJECTILE_DPS, null);
    } else if (option === "support") {
      // Support
      roles.role.set(CONST.ROLES.COMMUNITY.ROLES.FLEX_SUPPORT, null);
      roles.role.set(CONST.ROLES.COMMUNITY.ROLES.MAIN_SUPPORT, null);
    } else if (roleOptions.role.flex_support.includes(option)) {
      // Flex Support
      roles.role.set(CONST.ROLES.COMMUNITY.ROLES.FLEX_SUPPORT, null);
    } else if (roleOptions.role.main_support.includes(option)) {
      // Main Support
      roles.role.set(CONST.ROLES.COMMUNITY.ROLES.MAIN_SUPPORT, null);
    } else if (roleOptions.rank.bronze.includes(option)) {
      // Bronze
      roles.rank.set(CONST.ROLES.COMMUNITY.RANKS.BRONZE, null);
    } else if (roleOptions.rank.silver.includes(option)) {
      // Silver
      roles.rank.set(CONST.ROLES.COMMUNITY.RANKS.SILVER, null);
    } else if (roleOptions.rank.gold.includes(option)) {
      // Gold
      roles.rank.set(CONST.ROLES.COMMUNITY.RANKS.GOLD, null);
    } else if (roleOptions.rank.platinum.includes(option)) {
      // Platinum
      roles.rank.set(CONST.ROLES.COMMUNITY.RANKS.PLATINUM, null);
    } else if (roleOptions.rank.diamond.includes(option)) {
      // Diamond
      roles.rank.set(CONST.ROLES.COMMUNITY.RANKS.DIAMOND, null);
    } else if (roleOptions.rank.masters.includes(option)) {
      // Masters
      roles.rank.set(CONST.ROLES.COMMUNITY.RANKS.MASTERS, null);
    } else if (roleOptions.rank.grandmaster.includes(option)) {
      // Grandmaster
      roles.rank.set(CONST.ROLES.COMMUNITY.RANKS.GM, null);
    }
  }
  const addRolePromise: Promise<GuildMember>[] = [];
  const tempRole = await createRole;
  if (roles.region.size > 0 && roles.rank.size > 0 && roles.role.size > 0) {
    for (const [id, guildMember] of message.guild.members.cache) {
      const existingRoles = guildMember.roles.cache.intersect(roles.role);
      const existingRanks = guildMember.roles.cache.intersect(roles.rank);
      const existingRegions = guildMember.roles.cache.intersect(roles.region);
      if (existingRoles.size > 0 && existingRanks.size > 0 && existingRegions.size > 0) {
        pingMembers.set(id, guildMember);
        if (command === "ringer") addRolePromise.push(guildMember.roles.add(tempRole));
      }
    }
    if (command === "ringer") {
      const reply = `LFR ${options.join(", ")}\nPinged ${pingMembers.size} members\n${getNamesOfMembers(pingMembers).join(", ")}\n<@&${tempRole.id}>`;
      const pingMessage = await message.reply(`Processing request, please wait...`);
      await Promise.all(addRolePromise);
      pingMessage.delete();
      console.log(`[Ringer] ${reply}`);
      await message.reply(reply);
    } else if (command === "find") {
      const reply = `${options.join(", ")}:\n${getNamesOfMembers(pingMembers).join(", ")}`;
      console.log(`[Ringer] ${reply}`);
      await message.reply(reply);
    }
  } else {
    console.log(`[Ringer] Please provide a region, rank and role.`);
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

function getNamesOfMembers(pingedMembers: Collection<string, GuildMember>): string[] {
  const memberNames = [];
  for (const [, member] of pingedMembers) {
    memberNames.push(member.user.username);
  }
  return memberNames;
}
