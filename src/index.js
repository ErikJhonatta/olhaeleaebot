require("dotenv").config();
const { Client, Intents } = require("discord.js");
const { createReadStream } = require('fs');
const { join } = require('path');
const { createAudioPlayer, joinVoiceChannel, VoiceConnectionStatus, entersState, createAudioResource, NoSubscriberBehavior  } = require('@discordjs/voice');
const token = process.env.TOKEN;


const player = createAudioPlayer({
	behaviors: {
		noSubscriber: NoSubscriberBehavior.Play,
	},
});

const myIntents = new Intents();
myIntents.add(Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_VOICE_STATES);

const client = new Client({ intents: myIntents });

async function connectToChannel(channel) {
	const connection = joinVoiceChannel({
		channelId: channel.id,
		guildId: channel.guild.id,
		adapterCreator: channel.guild.voiceAdapterCreator,
	});
	try {
		await entersState(connection, VoiceConnectionStatus.Ready, 30_000);
		return connection;
	} catch (error) {
		connection.destroy();
		throw error;
	}
}

client.once("ready", () => {
  console.log("Client Ready");
});

client.on("voiceStateUpdate", async(oldState, newState) => {
    if(oldState.id != '940776968188747839' && newState.id != '940776968188747839'){
        if (oldState.channelId == null && newState.channelId != null) {
            const channel = client.channels.cache.get(newState.channelId);
            const connection = await connectToChannel(channel);

            setTimeout(async()=>{
                connection.subscribe(player);
                let resource = createAudioResource(createReadStream(join(__dirname, 'olha.mp3')), {
                  inlineVolume : true
                });
                player.play(resource);
            },1000);
            setTimeout(()=> {player.stop();connection.disconnect()},6000)
            
        
          }
          else if (oldState.channelId != null && newState.channelId == null) {
            console.log("Saiu");
          }
          else if((oldState.channelId && newState.channelId) && oldState.channelId != newState.channelId){
              console.log("Trocou")
          }
    }
});

client.login(token);

// const { generateDependencyReport } = require('@discordjs/voice');

// console.log(generateDependencyReport());