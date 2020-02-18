const Discord = require('discord.js')
const bot = new Discord.Client()



const token = process.env['DISCORD_BOT_TOKEN'];

const prefix = "!";

var version = '1.0.1';

bot.on('ready', () =>{
    console.log('The Plague has taken over!');
})

bot.on('message', msg =>{
    
    let args = msg.content.substring(prefix.length).split(" ");

    switch(args[0]){
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
            }else{
                msg.channel.sendMessage('Invalid Args')
            }
            break;
        case 'clear':
            if(!args[1]) return msg.reply('Error please define second arg')
            msg.channel.bulkDelete(args[1]);
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

            case 'lDru':
                const lDru = new Discord.RichEmbed()
                const attachment = new Image()
                // .setClass('logo')
                // .setSrc("file:///C:/Users/Dru's%20PC/Pictures/Plague%20Doctor/3541338_0.jpg")
                // img class="logo" src="file:///C:/Users/Dru's%20PC/Pictures/Plague%20Doctor/3541338_0.jpg" alt="My_Logo"
                .setTitle('Drus Media')
                .addField('Twitch', 'https://www.twitch.tv/ldruskii/')
                .addField('Twitter', 'https://twitter.com/lDruskii')
                .addField('Youtube', 'https://bit.ly/2UX4Ou2')
                .setColor(0x2D58A6)
                .setThumbnail(msg.author.img)
                .setFooter('Please follow and subcribe, it really helps out a lot!')
                msg.channel.sendEmbed(lDru);
                break;
    }
})

if(!token) {
    console.log('Token not present')
} else {
    bot.login(token)
    .catch(err => {
        console.log(`An error has occured here, catching so Node will not crash. Error: ${JSON.stringify(err)}`)
    })
}