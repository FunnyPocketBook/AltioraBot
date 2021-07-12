import * as Discord from "discord.js";
import * as CONST from "../util/constants.js";

export async function enroll(message: Discord.Message, options: string[]): Promise<void> {
  if (
    !message.member.roles.cache.has(CONST.ROLES.STAFF.TEAM_MANAGER) &&
    !message.member.roles.cache.has(CONST.ROLES.STAFF.OPERATIONS_STAFF) &&
    !message.member.roles.cache.has(CONST.ROLES.STAFF.BOSS_CASTER)
  )
    return;
  const [member, teamId] = await getMemberTeam(message, options);
  if (member === undefined || teamId === undefined) return;
  try {
    await member.roles.add(teamId);
    if (teamId !== CONST.ROLES.STAFF.CASTER) {
      await member.roles.add(CONST.ROLES.TEAMS.TRYOUT_ROLE);
    } else {
      message.channel.send(
        `Welcome ${member.toString()} to the casters! Please put your information into the spreadsheet and check the pinned messages!\nhttps://docs.google.com/spreadsheets/d/16HxRhCSh2PCUa-4PsIdvWoe-DpAmbT_0Y3rtVVvcF5A/edit?usp=sharing`
      );
    }
    message.react(CONST.EMOJIS.CHECKMARK);
  } catch (e) {
    message.react(CONST.EMOJIS.X);
    console.error(e);
  }
}

export async function derole(message: Discord.Message, options: string[]): Promise<void> {
  if (
    !message.member.roles.cache.has(CONST.ROLES.STAFF.TEAM_MANAGER) &&
    !message.member.roles.cache.has(CONST.ROLES.STAFF.OPERATIONS_STAFF) &&
    !message.member.roles.cache.has(CONST.ROLES.STAFF.BOSS_CASTER)
  )
    return;
  const [member, teamId] = await getMemberTeam(message, options);
  if (member === undefined || teamId === undefined) return;
  try {
    await member.roles.remove(teamId);
    const teamRoles = new Discord.Collection<string, Discord.Role>();
    for (const [, id] of Object.entries(CONST.ROLES.TEAMS.TRYOUTS)) {
      teamRoles.set(id, await message.guild.roles.fetch(id));
    }
    const roleDifference = member.roles.cache.intersect(teamRoles);
    if (roleDifference.size === 0) await member.roles.remove(CONST.ROLES.TEAMS.TRYOUT_ROLE);
    message.react(CONST.EMOJIS.CHECKMARK);
  } catch (e) {
    message.react(CONST.EMOJIS.X);
    console.error(e);
  }
}

async function getMemberTeam(message: Discord.Message, options: string[]): Promise<[Discord.GuildMember, string]> {
  const user: Discord.User = message.mentions.users.first();
  let member: Discord.GuildMember;
  if (user === undefined) {
    member = message.guild.members.cache.find((u) => u.user.tag === options[0]);
    if (member === undefined) {
      const response = await message.reply(options[0] ? `Member ${options[1]} could not be found.` : "Please provide a member name.");
      setTimeout(async () => await response.delete(), 5000);
      return [undefined, undefined];
    }
  } else {
    member = await message.guild.members.fetch(user);
  }
  let teamId = CONST.ROLES.TEAMS.TRYOUTS[options[1]?.toLocaleUpperCase()];
  if (options[1]?.toLocaleLowerCase() === "casters" || options[1]?.toLocaleLowerCase() === "caster") {
    teamId = CONST.ROLES.STAFF.CASTER;
  } else if (teamId === undefined) {
    const response = await message.reply(options[1] ? `Team ${options[1]} could not be found.` : "Please provide a team name.");
    setTimeout(async () => await response.delete(), 5000);
    return [undefined, undefined];
  }
  return [member, teamId];
}
