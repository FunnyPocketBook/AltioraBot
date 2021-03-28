import * as Discord from "discord.js";
import * as CONST from "../util/constants.js";

export async function enroll(message: Discord.Message, options: string[]): Promise<void> {
  if (!message.member.roles.cache.has(CONST.ROLES.STAFF.TEAM_MANAGER) && !message.member.roles.cache.has(CONST.ROLES.STAFF.OPERATIONS_STAFF)) return;
  const user = message.mentions.users.first();
  if (user === undefined) {
    message.reply("Please mention a user.");
    return;
  }
  const member = await message.guild.members.fetch(user);
  const teamId = CONST.ROLES.TEAMS.TRYOUTS[options[1]?.toLocaleUpperCase()];
  if (teamId === undefined) {
    message.reply("Please provide the name of the team.");
    return;
  }
  try {
    await member.roles.add(teamId);
    await member.roles.add(CONST.ROLES.TEAMS.TRYOUT_ROLE);
    message.react(CONST.EMOJIS.CHECKMARK);
  } catch (e) {
    message.react(CONST.EMOJIS.X);
    console.error(e);
  }
}

export async function derole(message: Discord.Message, options: string[]): Promise<void> {
  if (!message.member.roles.cache.has(CONST.ROLES.STAFF.TEAM_MANAGER) && !message.member.roles.cache.has(CONST.ROLES.STAFF.OPERATIONS_STAFF)) return;
  const user = message.mentions.users.first();
  if (user === undefined) {
    message.reply("Please mention a user.");
    return;
  }
  const member = await message.guild.members.fetch(user);
  const teamId = CONST.ROLES.TEAMS.TRYOUTS[options[1]?.toLocaleUpperCase()];
  if (teamId === undefined) {
    message.reply("Please provide the name of the team.");
    return;
  }
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
