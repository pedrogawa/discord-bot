import { Client, Events, GatewayIntentBits, TextChannel } from "discord.js";
import { config } from "dotenv";

config();

const activeUsers: any[] = [];

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
  ],
});

client.once(Events.ClientReady, (message) => {
  const channel = message.channels.cache.get("1120815036785508382")!;
  (channel as TextChannel).send("Bot is ready!");
});

client.on(Events.MessageCreate, async (message) => {
  if (message.content.startsWith("!reminder")) {
    const messageSent = message.channel.send("React for minutes or hours.");
    (await messageSent).react("1️⃣");
    (await messageSent).react("2️⃣");
  }
});

client.on(Events.MessageReactionAdd, async (reaction, user) => {
  if (user.id === client.user!.id) return;

  if (reaction.emoji.name === "1️⃣") {
    console.log("User chose minutes");
    setTimeout(() => {
      reaction.message.channel.send(`<@${user.id}> Reminder after 1 minute!`);
    }, 60 * 1000);
  } else if (reaction.emoji.name === "2️⃣") {
    console.log("User chose hours");
  }
});

client.on(Events.MessageCreate, (message) => {
  const id = message.author.id;
  const { createdTimestamp } = message;
  const user = activeUsers.find((user) => user.id === id);

  if (message.content.startsWith("!start")) {
    if (user) {
      if (user.session) {
        message.reply("You already have an active session.");
      } else {
        message.reply("Session started!");
        user.session = true;
        user.createdAt = createdTimestamp;
      }
    } else {
      message.reply("Session started!");
      activeUsers.push({
        id,
        session: true,
        createdAt: new Date(message.createdAt),
      });
    }
  } else if (message.content.startsWith("!end")) {
    if (user) {
      if (user.session) {
        message.reply(
          `Your study session lasted ${
            (createdTimestamp - user.createdAt) / 1000
          } seconds`
        );
        user.session = false;
      } else {
        message.reply(
          "You don't have an active session. Type !start to start a session."
        );
      }
    }
  }
});

client.login(process.env.DISCORD_BOT_TOKEN);
