import { GuildChannelManager, GuildCreateChannelOptions, Message, GuildChannel, GuildMember } from "discord.js";
import * as Config from "./config.js";

export async function createVoiceChannel(
  message: Message,
  name: string,
  options: GuildCreateChannelOptions,
  tempVoiceChannels: [GuildChannel, GuildMember][]
): Promise<[GuildChannel, GuildMember]> {
  const channelManager = new GuildChannelManager(message.guild);
  const creator = message.member;
  const config = Config.loadConfig();
  if (tempVoiceChannels.find((e) => e[1].id === creator.id)) {
    message.reply(`You already have created a channel. Please make sure that the existing channel gets removed first before creating a new channel.`);
    return null;
  }
  const channel = await channelManager.create(name, options);
  message.reply(`The channel "${name}" has been created under the category "Community".
Please join the voice channel within ${config.options.tempVCIdleTime} seconds, else the channel will be deleted.
The channel will be deleted after every member has left the voice channel.`);
  return [channel, creator];
}
