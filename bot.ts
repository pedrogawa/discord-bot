import { Client, Events, GatewayIntentBits, TextChannel } from "discord.js";
import { config } from "dotenv";

config();

const activeUsers: any = {};

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessages,
  ],
});

client.once(Events.ClientReady, (message) => {
  const channel = message.channels.cache.get("1120815036785508382")!;
  (channel as TextChannel).send("Bot is ready!");
});

client.on(Events.MessageCreate, (message) => {
  const id = message.author.id;
  if (message.content.startsWith("!start")) {
    if (activeUsers[id]) {
      message.reply("You already have an active session.");
    } else {
      message.reply("Session started!");
      activeUsers[id] = {
        session: true,
        timeStamp: message.createdTimestamp,
      };
    }
  } else if (message.content.startsWith("!end")) {
    if (activeUsers[id]) {
      message.reply(
        `Your study session lasted ${
          message.createdTimestamp - activeUsers[id].timeStamp
        }`
      );
    } else {
      message.reply(
        "You don't have an active session. Type !start to start one session."
      );
    }
  }
});

client.login(process.env.DISCORD_BOT_TOKEN);
