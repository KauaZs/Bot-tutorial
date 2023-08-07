module.exports = {
    name: 'ping',
    aliases: ['latencia'],
    run: async(client, message, args) => {
        message.reply(`🏓 | Minha latencia é de \`${client.ws.ping}ms\``)
    }
}