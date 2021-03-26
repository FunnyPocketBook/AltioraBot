import * as Discord from "discord.js";
import * as CONST from "../util/constants.js";

export async function enroll(message: Discord.Message, options: string[]): Promise<void> {
  if (!message.member.roles.cache.has(CONST.ROLES.STAFF.TEAM_MANAGER)) return;
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
  member.roles.add(teamId);
  member.roles.add(CONST.ROLES.TEAMS.TRYOUT_ROLE);
}

export async function derole(message: Discord.Message, options: string[]): Promise<void> {
  if (!message.member.roles.cache.has(CONST.ROLES.STAFF.TEAM_MANAGER)) return;
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
  await member.roles.remove(teamId);
  const teamRoles = new Discord.Collection<string, Discord.Role>();
  for (const [name, id] of Object.entries(CONST.ROLES.TEAMS.TRYOUTS)) {
    teamRoles.set(name, await message.guild.roles.fetch(id));
  }
  const roleDifference = member.roles.cache.intersect(teamRoles);
  if (roleDifference.size === 0) member.roles.remove(CONST.ROLES.TEAMS.TRYOUT_ROLE);
}
