const { unabbreviate } = require('util-stunks')
const Discord = require('discord.js')
module.exports = {
    name: 'bet',
    aliases: ['apostar'],
    run: async(client, message, args) => {
        const user = message.mentions.members.first() || message.guild.members.cache.get(args[0])
        if(!user) return message.reply(`:x: | Mencione um ususário para apostar! Exemplo \`.bet <user> <valor>\``)
        if(user.bot) return message.reply(`:x: | ${message.author}, Você não pode apostar com bots`)

        const balAuthor = client.database.get(`${message.author.id}.coins`) || 0
        const balUser = client.database.get(`${user.id}.coins`) || 0

        const amount = unabbreviate(args[1])
        if(!args[1]) return message.reply(`:x: | ${message.author}, Defina o valor que irá ser apostado! Exemplo \`.bet <user> <valor>\``)
        if(isNaN(amount)) return message.reply(`:x: | ${message.author}, O valor de aposta deve ser um número`)
        if(amount < 1) return message.reply(`:x: | ${message.author}, Aposte valores positivos.`)
        if(balAuthor < amount) return message.reply(`:x: | ${message.author}, Você não essa quantia para apostar.`)
        if(balUser < amount) return message.reply(`:x: | ${message.author}, \`${user.user.username}\` não essa quantia para apostar.`)

        let hasAccept = false;

        const button_accept = new Discord.ButtonBuilder()
        .setLabel('Aceitar')
        .setCustomId('accept')
        .setStyle(Discord.ButtonStyle.Success)
        
        const row = new Discord.ActionRowBuilder().addComponents(button_accept)

        const msg = await message.reply({
            content: `🪙 **|** ${user}, \`${message.author.username}\` deseja apostar ${amount} coins com você`,
            components: [row]
        })
        const collector = msg.createMessageComponentCollector({
            time: 60000,
            filter: (x) => x.user.id === user.id
        })

        collector.on('collect', async (int) => {
            if(int.customId === 'accept') {
                const ids = [message.author, user]
                const winner = ids[Math.floor(Math.random() * ids.length)]
                const loser = ids.filter(x => x != winner)

                client.database.add(`${winner.id}.coins`, amount)
                client.database.subtract(`${loser.id}.coins`, amount)
                hasAccept = true
                int.update({
                    content: `✅ | ${winner} venceu a aposta de **${amount}** contra ${loser}`, components: []
                })
                collector.stop()
            }
        })
        collector.on('end', async (int) => {
            if(hasAccept) return
            row.components[0].setDisabled(true).setLabel('Aposta expirada').setStyle(Discord.ButtonStyle.Danger)

            msg.edit({
                components: [row]
            })
        })
    } 
}