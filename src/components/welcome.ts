import { GuildMember, PartialGuildMember, TextChannel, Channel, Client } from "discord.js";
import * as CONST from "../util/constants.js";
import * as Interfaces from "../types/interface.js";

export async function sendWelcomeMessage(
  client: Client,
  config: Interfaces.Config,
  oldMember: GuildMember | PartialGuildMember,
  newMember: GuildMember
): Promise<void> {
  const roleDifference = oldMember.roles.cache.difference(newMember.roles.cache);
  for (const role of roleDifference) {
    const roleId = role[1].id;
    if (newMember.roles.cache.has(roleId)) {
      // Find team name and gaming channel from role ID
      let teamName, gamingName;
      const teamElement = Object.entries(CONST.ROLES.TEAMS.TRYOUTS).find((r) => r[1] === roleId);
      const gamingElement = Object.entries(CONST.ROLES.ALTIORA.GAMING).find((r) => r[1] === roleId);
      if (teamElement) {
        teamName = teamElement[0];
      } else if (gamingElement) {
        gamingName = gamingElement[0];
      }
      let welcomeMessage = "";
      let channel: Channel = null;
      if (teamName) {
        // Tryouts role
        channel = client.channels.cache.get(CONST.CHANNELS.TEAMS[teamName].TRYOUTS);
        teamName = CONST.CHANNELS.TEAMS[teamName].NAME;
        if (teamName === CONST.CHANNELS.TEAMS.KILIMANJARO.NAME) {
          welcomeMessage = config.options.tryoutsValorantWelcomeMsg.replace(/\{member\}/g, newMember.toString()).replace(/\{teamName\}/g, teamName);
        } else {
          welcomeMessage = config.options.tryoutsWelcomeMsg.replace(/\{member\}/g, newMember.toString()).replace(/\{teamName\}/g, teamName);
        }
      } else if (roleId === CONST.ROLES.ALTIORA.ALTIORA) {
        // Altiora role
        channel = client.channels.cache.get(CONST.CHANNELS.ALTIORA.FRIENDS_CHAT);
        const altioraRoleMenu = client.channels.cache.get(CONST.CHANNELS.ALTIORA.ALTIORA_ROLE_MENU);
        welcomeMessage = config.options.altioraWelcomeMsg
          .replace(/\{member\}/g, newMember.toString())
          .replace(/\{altioraRoleMenu\}/g, altioraRoleMenu.toString());
      } else if (roleId === CONST.ROLES.ALTIORA.MINECRAFT) {
        // Minecraft role
        channel = client.channels.cache.get(CONST.CHANNELS.ALTIORA.GAMING.MINECRAFT.ID);
        welcomeMessage = config.options.minecraftWelcomeMsg.replace(/\{member\}/g, newMember.toString());
      } else if (roleId === CONST.ROLES.ALTIORA.OSU) {
        // Osu role
        channel = client.channels.cache.get(CONST.CHANNELS.ALTIORA.GAMING.OSU.ID);
        welcomeMessage = config.options.osuWelcomeMsg.replace(/\{member\}/g, newMember.toString());
      } else if (roleId === CONST.ROLES.ALTIORA.ANIMAL_CROSSING) {
        // Animal Crossing role
        channel = client.channels.cache.get(CONST.CHANNELS.ALTIORA.GAMING.ANIMAL_CROSSING.ID);
        welcomeMessage = config.options.animalCrossingWelcomeMsg.replace(/\{member\}/g, newMember.toString());
      } else if (gamingName) {
        // Generic gaming role
        channel = client.channels.cache.get(CONST.CHANNELS.ALTIORA.GAMING[gamingName].ID);
        welcomeMessage = config.options.gamingWelcomeMsg
          .replace(/\{member\}/g, newMember.toString())
          .replace(/\{channelName\}/g, CONST.CHANNELS.ALTIORA.GAMING[gamingName].NAME);
      }
      if (channel !== null) {
        const message = await (channel as TextChannel).send(welcomeMessage);
        console.log(`${message.id}: [Role] ${welcomeMessage}`);
      }
    }
  }
}
