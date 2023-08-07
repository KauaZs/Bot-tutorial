const client = require('../index')
module.exports = {
    name: 'messageCreate',
    run: async(message) => {
        if(message.author.bot) return

        const prefix = '.'
        if(message.content.replace('!','') === `<@${client.user.id}>`) return message.reply(`😁 Olá ${message.author}, sou um simples bot do discord.`)

        if(!message.content.startsWith(prefix)) return
        const args = message.content.slice(prefix.length).trim().split(' ')

        const command = args.shift()?.toLowerCase()
        const cmd = client.commands.get(command) || client.commands.find(als => als.aliases && als.aliases.includes(command))
        if(cmd) return cmd.run(client, message, args)
    }
}