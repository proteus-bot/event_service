const util = require('util');
const Discord = require('discord.js');
const PubSub = require('@google-cloud/pubsub');

const topicDiscordOnMessage = process.env.PROTEUS_TOPIC_DISCORD_ON_MESSAGE;

const pubsub = new PubSub();

const client = new Discord.Client();

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', message => {
  const data = JSON.stringify({
    id: message.id,
    author: message.author.id,
    channel: message.channel.id,
    channelType: typeof message.channel,
    content: message.content,
    cleanContent: message.cleanContent,
  });
  const dataBuffer = Buffer.from(data);

  pubsub
    .topic(topicDiscordOnMessage)
    .publisher()
    .publish(dataBuffer)
    .then(messageId => {
      console.log(`Message ${messageId} published. Message details: ${data}`);
    })
    .catch(err => {
      console.error(err);
    })
});

client.login(process.env.PROTEUS_BOT_TOKEN)
  .catch(err => {
    console.error(err);
});