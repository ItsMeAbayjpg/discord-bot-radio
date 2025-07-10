require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const { joinVoiceChannel, createAudioPlayer, createAudioResource } = require('@discordjs/voice');
const ytdl = require('ytdl-core');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates
  ]
});

const GUILD_ID = process.env.GUILD_ID;
const VOICE_CHANNEL_ID = process.env.VOICE_CHANNEL_ID;
const YOUTUBE_URL = 'https://www.youtube.com/watch?v=jfKfPfyJRdk';

client.once('ready', async () => {
  console.log(`✅ Bot login sebagai ${client.user.tag}`);
  const guild = await client.guilds.fetch(GUILD_ID);
  const channel = await guild.channels.fetch(VOICE_CHANNEL_ID);

  const connection = joinVoiceChannel({
    channelId: channel.id,
    guildId: guild.id,
    adapterCreator: guild.voiceAdapterCreator
  });

  const stream = ytdl(YOUTUBE_URL, {
    filter: 'audioonly',
    quality: 'highestaudio',
    highWaterMark: 1 << 25
  });

  const resource = createAudioResource(stream);
  const player = createAudioPlayer();
  player.play(resource);
  connection.subscribe(player);
});

client.login(process.env.TOKEN);
