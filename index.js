const Discord = require('discord.js')
const bot = new Discord.Client()
const AntiSpam = require('discord-anti-spam');
const ytSearch = require('yt-search');
const ytPlayer = require('youtube-dl');

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
})


const token = process.env['DISCORD_BOT_TOKEN'];

const prefix = "!";

var version = '1.0.1';

bot.on('ready', () => {
    console.log('The Plague has taken over!');
})

bot.on('message', msg => {
    
    antiSpamClient.message(msg);
    let args = msg.content.substring(prefix.length).split(" ");

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
                msg.channel.sendMessage('Version ' + version);
            } else {
                msg.channel.sendMessage('Invalid Args')
            }
            break;

        case 'clean':
            if(msg.member.roles.find(role => ADMIN_ROLES.includes(role.name))) {
                if(!args[1]) {
                    msg.reply('Error please define second arg')
                } else {
                    let deleteCount = args[1];
                    //TODO: Should probably verify the user wants to delete N number of messages over a certain amount
                    msg.channel.bulkDelete(deleteCount)
                    return msg.channel.send(`     **${msg.author.username}** - you have deleted ` +"`" + deleteCount +"`" + `${deleteCount > 1 ? 'messages' : 'message'}`)
                    .then(res => setTimeout(() =>  res.delete(res), 4000))
                }
            } else {
                msg.reply('You do not have permission to do that')
            }
            break;

        case 'embed':
            const embed = new Discord.RichEmbed()
            .setTitle('User Information')
            .addField('Player Name', msg.author.username)
            .addField('Version', version)
            .addField('Current Server', msg.guild.name)
            .setColor(0x2D58A6)
            .setThumbnail(msg.author.avatarURL)
            .setFooter('Test')
            msg.channel.sendEmbed(embed);
            break;

        case 'ldru':
            const lDru = new Discord.RichEmbed()
            .setImage("https://i3.sndcdn.com/avatars-dmPQwZHSfv34Hb2l-ZaBa8g-t500x500.jpg")
            .setTitle('Drus Media')
            .addField('Twitch', 'https://www.twitch.tv/ldruskii/')
            .addField('Twitter', 'https://twitter.com/lDruskii')
            .addField('Youtube', 'https://bit.ly/2UX4Ou2')
            .setColor(0x2D58A6)
            .setThumbnail(msg.author.img)
            .setFooter('Please follow and subcribe, it really helps out a lot!')
            msg.channel.send(lDru);
            break;

        case 'plays':
            args.splice(0, 1)
            let selection = args.join(" ")
            YoutubePlayer(selection, bot, msg)
            break;
    }
})

const YoutubePlayer = (songName, client, message) => {
    return ytSearch(songName)
    .then((results) => {
        console.log(results.videos[0]);
        return results.videos[0].url;
    })
    .then(videoUrl => {
        let video = ytPlayer(videoUrl, [], { filter : 'audioonly' });
        let channel = message.member.voiceChannel;
        if(!channel) {
            message.reply('You must be in a voice channel to do this.');
            return;
        }


        return channel.join().then(connection => {
            const dispatcher = connection.playStream(video, {})

        })
    })
    .catch(err => {
        console.dir(err)
        msg.reply("Sorry, I'm broken right now!")
    })
}

if(!token) {
    throw new Error('DISCORD_BOT_TOKEN not found')
} else {
    bot.login(token)
    .catch(err => {
        console.log(`An error has occured here, catching so Node will not crash. Error: ${JSON.stringify(err)}`)
    })
}