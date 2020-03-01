import * as Discord from 'discord.js';
const bot = new Discord.Client()
const AntiSpam = require('discord-anti-spam');
const ytPlayer = require('youtube-dl');
const ytSearch = require('yt-search');
import * as Interfaces from './interfaces';

const ADMIN_ROLES = ['Plague Doctor', 'Mad Doctor'];

const antiSpamClient = new AntiSpam({
    warnThreshold: 5,
    kickThreshold: 7,
    banThreshold: 7,
    maxInterval: 2000,
    warnMessage: '{@user}, Please stop spamming.',
    banMessage: '**{user_tag}** has been banned for spamming',
    kickMessage: '**{user_tag}** has been banned for spamming',
    maxDuplicatesWarning: 7,
    maxDuplicatesKick: 10,
    maxDuplicatesBan: 12, 
    exemptPermissions: [ 'ADMINISTRATOR'],
    ignoreBots: false, 
    verbose: true,
    ignoredUsers: [],
});

const TOKEN = process.env['DISCORD_BOT_TOKEN'];
const PREFIX = "!";
const VERSION = '1.0.1';

bot.on('ready', () => {
    console.log('The Plague has taken over!');
})

bot.on('message', (msg: Discord.Message) => {
    
    antiSpamClient.message(msg);
    let args: string[] = msg.content.substring(PREFIX.length).split(" ");

    switch(args[0].toLowerCase()) {
        case 'ping':
            msg.channel.sendMessage('pong');
            break;
            
        case 'youtube':
            msg.channel.sendMessage('https://bit.ly/2UX4Ou2')
            break;

        case 'twitter':
            msg.channel.sendMessage('https://www.twitter.com/ldruskii')
            break;

        case 'mixer':
            msg.channel.sendMessage('https://www.mixer.com/ldru')
            break;

        case 'info':
            if(args[1] === 'version'){
                msg.channel.sendMessage('Version ' + VERSION);
            } else {
                msg.channel.sendMessage('Invalid Args')
            }
            break;

        case 'clean':
            if(msg.member.roles.find(role => ADMIN_ROLES.includes(role.name))) {
                if(!args[1]) {
                    msg.reply('Error please define second arg')
                } else {
                    let deleteCount: number = Number(args[1]);
                    //TODO: Should probably verify the user wants to delete N number of messages over a certain amount
                    return msg.channel.bulkDelete(deleteCount)
                    .then(() => msg.channel.send(`     **${msg.author.username}** - you have deleted ` +"`" + deleteCount +"`" + `${deleteCount > 1 ? 'messages' : 'message'}`))
                    .then((res: Discord.Message | Discord.Message[]) => {
                        if(Array.isArray(res)) {
                            return Promise.all(res.map((msg: Discord.Message) => msg.delete(4000)))
                        } else {
                            res.delete(4000)
                        }
                    })
                }
            } else {
                msg.reply('You do not have permission to do that')
            }
            break;

        case 'embed':
            const embed = new Discord.RichEmbed()
            .setTitle('User Information')
            .addField('Player Name', msg.author.username)
            .addField('Version', VERSION)
            .addField('Current Server', msg.guild.name)
            .setColor(0x2D58A6)
            .setThumbnail(msg.author.avatarURL)
            .setFooter('Test')
            return msg.channel.sendEmbed(embed);

        case 'ldru':
            const lDru = new Discord.RichEmbed()
            .setImage("https://i3.sndcdn.com/avatars-dmPQwZHSfv34Hb2l-ZaBa8g-t500x500.jpg")
            .setTitle('Drus Media')
            .addField('Twitch', 'https://www.twitch.tv/ldruskii/')
            .addField('Twitter', 'https://twitter.com/lDruskii')
            .addField('Youtube', 'https://bit.ly/2UX4Ou2')
            .setColor(0x2D58A6)
            .setThumbnail(msg.author.avatar)
            .setFooter('Please follow and subcribe, it really helps out a lot!')
            return msg.channel.send(lDru);

        case 'pm':
            args.splice(0, 1)
            let selection: string = args.join(" ")
            YoutubePlayer(selection, bot, msg)
            break;
        
        case "startrecord":
            let voiceChannel = msg.member.voiceChannel;
            if(!voiceChannel) {
                return msg.reply('You are not in a voice channel')
            } 

            return voiceChannel.join()
            .then(connection => {
                //Use connection to create a receiver
            })
    }
})


/*
    This needs lots of iteration. We should store the instance of a player to be able to start / stop / cancel songs, as well as queue songs with the instance
    We also have no way of completely stopping a player, and having the bot leave the channel

    the only good way to do this is to run this as a class, and store these as references, 
*/
const YoutubePlayer = (songName: string, client: Discord.Client, message: Discord.Message): Promise<any> => {
    return ytSearch(songName)
    .then((results: {[key: string]: any}) => results.videos[0].url)   //Return the first song's URL
    .then((videoUrl: string) => {
        
        if (new RegExp(/polyphia/gi)) {
            videoUrl = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
        }
        let video = ytPlayer(videoUrl, [], { filter : 'audioonly' });
        let channel = message.member.voiceChannel;
        if(!channel) {
            return message.reply('You must be in a voice channel to do this.');
        }

        return channel.join().then(connection => {
            const dispatcher = connection.playStream(video, {})
            dispatcher.on('error', () => {
                channel.leave();	
            })
            .on('error', err => {
                channel.leave();
                console.dir(err)
            })

            return;
        })
    })
    .catch((err: Error) => {
        console.dir(err)
        return message.reply("Sorry, I'm broken right now!")
    })
}

if(!TOKEN) {
    throw new Error('DISCORD_BOT_TOKEN not found')
} else {
    bot.login(TOKEN)
    .catch(err => {
        console.log(`An error has occured here, catching so Node will not crash. Error: ${JSON.stringify(err)}`)
    })
}
