const Discord = require('discord.js');
const PubSub = require('@google-cloud/pubsub');

const topicDiscordOnMessage = process.env.PROTEUS_TOPIC_DISCORD_ON_MESSAGE;

const pubsub = new PubSub();

const client = new Discord.Client();

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
  const data = JSON.stringify({ message: msg.content });
  const dataBuffer = Buffer.from(data);

  pubsub
    .topic(topicDiscordOnMessage)
    .publisher()
    .publish(dataBuffer)
    .then(messageId => {
      console.log(`Message ${messageId} published.`);
    })
    .catch(err => {
      console.error(err);
    })
});

client.login(process.env.PROTEUS_BOT_TOKEN)
  .catch(err => {
    console.error(err);
});