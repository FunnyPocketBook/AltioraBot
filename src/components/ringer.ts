import { Message, Collection, Role, GuildMember, TextChannel } from "discord.js";
import * as Util from "../util/util.js";
import * as CONST from "../util/constants.js";

const roleOptions = {
  region: {
    na_ringer: ["na", "na ringer", "na ringers", "nar"],
    eu_ringer: ["eu", "eu ringer", "eu ringers", "eur"]
  },
  role: {
    main_tank: ["mt", "main tank", "maintank", "tank"],
    off_tank: ["ot", "off tank", "offtank", "tank"],
    hitscan_dps: ["hs", "hitscan", "hsdps", "hitscan dps", "hdps", "dps"],
    projectile_dps: ["proj", "projectile", "projectile dps", "proj dps", "flex dps", "fdps", "dps"],
    flex_support: ["fs", "flexsupport", "flex support", "support"],
    main_support: ["ms", "mainsupport", "main support", "support"]
  },
  rank: {
    bronze: ["bronze"],
    silver: ["silver"],
    gold: ["gold"],
    platinum: ["platinum", "plat"],
    diamond: ["diamond", "dia"],
    masters: ["masters", "master"],
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
  for (let option of options) {
    option = Util.removeDoubleQuotes(option.toLowerCase());
    // Region
    for (const [name, region] of Object.entries(roleOptions.region)) {
      if (region.includes(option)) {
        roles.region.set(CONST.ROLES.COMMUNITY[name.toUpperCase()], null);
      }
    }
    for (const [name, role] of Object.entries(roleOptions.role)) {
      if (role.includes(option)) {
        roles.role.set(CONST.ROLES.COMMUNITY.ROLES[name.toUpperCase()], null);
      }
    }
    for (const [name, rank] of Object.entries(roleOptions.rank)) {
      if (rank.includes(option)) {
        roles.rank.set(CONST.ROLES.COMMUNITY.RANKS[name.toUpperCase()], null);
      }
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
    // If pings are unreliable, do not create a temp role but ping the members directly
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
