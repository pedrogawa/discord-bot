import { Client, Events, GatewayIntentBits, messageLink } from "discord.js";

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once(Events.ClientReady, () => {
  console.log("Bot is ready!");
});

client.once(Events.MessageCreate, () => {
  //create a message to any channel when the bot is ready
  const channel = client.channels.cache.get("811993784505677056");
  console.log(channel);
});

client.on(Events.MessageCreate, (message) => {
  if (message.content === "!ping") {
    console.log("Pong");
  }
});
