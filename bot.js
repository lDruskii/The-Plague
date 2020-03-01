"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var Discord = __importStar(require("discord.js"));
var bot = new Discord.Client();
var AntiSpam = require('discord-anti-spam');
var ytPlayer = require('youtube-dl');
var ytSearch = require('yt-search');
var ADMIN_ROLES = ['Plague Doctor', 'Mad Doctor'];
var antiSpamClient = new AntiSpam({
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
    exemptPermissions: ['ADMINISTRATOR'],
    ignoreBots: false,
    verbose: true,
    ignoredUsers: [],
});
var TOKEN = process.env['DISCORD_BOT_TOKEN'];
var PREFIX = "!";
var VERSION = '1.0.1';
bot.on('ready', function () {
    console.log('The Plague has taken over!');
});
bot.on('message', function (msg) {
    antiSpamClient.message(msg);
    var args = msg.content.substring(PREFIX.length).split(" ");
    switch (args[0].toLowerCase()) {
        case 'ping':
            msg.channel.sendMessage('pong');
            break;
        case 'youtube':
            msg.channel.sendMessage('https://bit.ly/2UX4Ou2');
            break;
        case 'twitter':
            msg.channel.sendMessage('https://www.twitter.com/ldruskii');
            break;
        case 'mixer':
            msg.channel.sendMessage('https://www.mixer.com/ldru');
            break;
        case 'info':
            if (args[1] === 'version') {
                msg.channel.sendMessage('Version ' + VERSION);
            }
            else {
                msg.channel.sendMessage('Invalid Args');
            }
            break;
        case 'clean':
            if (msg.member.roles.find(function (role) { return ADMIN_ROLES.includes(role.name); })) {
                if (!args[1]) {
                    msg.reply('Error please define second arg');
                }
                else {
                    var deleteCount_1 = Number(args[1]);
                    //TODO: Should probably verify the user wants to delete N number of messages over a certain amount
                    return msg.channel.bulkDelete(deleteCount_1)
                        .then(function () { return msg.channel.send("     **" + msg.author.username + "** - you have deleted " + "`" + deleteCount_1 + "`" + ("" + (deleteCount_1 > 1 ? 'messages' : 'message'))); })
                        .then(function (res) {
                        if (Array.isArray(res)) {
                            return Promise.all(res.map(function (msg) { return msg.delete(4000); }));
                        }
                        else {
                            res.delete(4000);
                        }
                    });
                }
            }
            else {
                msg.reply('You do not have permission to do that');
            }
            break;
        case 'embed':
            var embed = new Discord.RichEmbed()
                .setTitle('User Information')
                .addField('Player Name', msg.author.username)
                .addField('Version', VERSION)
                .addField('Current Server', msg.guild.name)
                .setColor(0x2D58A6)
                .setThumbnail(msg.author.avatarURL)
                .setFooter('Test');
            return msg.channel.sendEmbed(embed);
        case 'ldru':
            var lDru = new Discord.RichEmbed()
                .setImage("https://i3.sndcdn.com/avatars-dmPQwZHSfv34Hb2l-ZaBa8g-t500x500.jpg")
                .setTitle('Drus Media')
                .addField('Twitch', 'https://www.twitch.tv/ldruskii/')
                .addField('Twitter', 'https://twitter.com/lDruskii')
                .addField('Youtube', 'https://bit.ly/2UX4Ou2')
                .setColor(0x2D58A6)
                .setThumbnail(msg.author.avatar)
                .setFooter('Please follow and subcribe, it really helps out a lot!');
            return msg.channel.send(lDru);
        case 'pm':
            args.splice(0, 1);
            var selection = args.join(" ");
            YoutubePlayer(selection, bot, msg);
            break;
        case "startrecord":
            var voiceChannel = msg.member.voiceChannel;
            if (!voiceChannel) {
                return msg.reply('You are not in a voice channel');
            }
            return voiceChannel.join()
                .then(function (connection) {
                //Use connection to create a receiver
            });
    }
});
/*
    This needs lots of iteration. We should store the instance of a player to be able to start / stop / cancel songs, as well as queue songs with the instance
    We also have no way of completely stopping a player, and having the bot leave the channel

    the only good way to do this is to run this as a class, and store these as references,
*/
var YoutubePlayer = function (songName, client, message) {
    return ytSearch(songName)
        .then(function (results) { return results.videos[0].url; }) //Return the first song's URL
        .then(function (videoUrl) {
        if (new RegExp(/polyphia/gi)) {
            videoUrl = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
        }
        var video = ytPlayer(videoUrl, [], { filter: 'audioonly' });
        var channel = message.member.voiceChannel;
        if (!channel) {
            return message.reply('You must be in a voice channel to do this.');
        }
        return channel.join().then(function (connection) {
            var dispatcher = connection.playStream(video, {});
            dispatcher.on('error', function () {
                channel.leave();
            })
                .on('error', function (err) {
                channel.leave();
                console.dir(err);
            });
            return;
        });
    })
        .catch(function (err) {
        console.dir(err);
        return message.reply("Sorry, I'm broken right now!");
    });
};
if (!TOKEN) {
    throw new Error('DISCORD_BOT_TOKEN not found');
}
else {
    bot.login(TOKEN)
        .catch(function (err) {
        console.log("An error has occured here, catching so Node will not crash. Error: " + JSON.stringify(err));
    });
}
