const { relativeTime } = require('util-stunks')
const Discord = require('discord.js')
const ms = require('ms')
module.exports = {
    name: 'trabalhar',
    aliases: ['work'],
    run: async(client, message, args) => {
        const userdb = client.database.get(`${message.author.id}`)
        if(userdb?.cooldowns?.work > Date.now()) return message.reply(`:x: | ${message.author}, Você trabalhou recentemente aguarde **${relativeTime(userdb.cooldowns.work, {removeMs: true, display: 2})}**`)

        function random(min, max) {
            return Math.round(Math.random() * (max - min) - min)
        }
        const valor = random(100, 1000)
        const jobs = ['pescador', 'advogado', 'policial','samu']
        const embed = new Discord.EmbedBuilder()
        .setTitle(`💼 Work`)
        .setDescription(`Você recebeu **${valor.toLocaleString()}** coins trabalhando de \`${jobs[Math.floor(Math.random() * jobs.length)]}\``)
        .setThumbnail('https://cdn.discordapp.com/attachments/995031082812575805/1138047906750935040/5517030.png')
        .setColor('#53b6d4')

        client.database.add(`${message.author.id}.coins`, valor)
        client.database.set(`${message.author.id}.cooldowns.work`, Date.now() + ms('2h'))

        message.reply({
            embeds: [embed]
        })
    }
}