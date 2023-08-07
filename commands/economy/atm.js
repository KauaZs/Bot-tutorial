module.exports = {
    name: 'atm',
    aliases: ['saldo', 'bal'],
    run: async (client, message, args) => {
        const user = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;

        const saldo = client.database.get(`${user.user.id}.coins`) || 0;
        message.reply(`:coin: | ${message.author}, \`${user.user.id === message.author.id ? 'você' : user.user.username}\` tem **${saldo.toLocaleString()}** coins`)
    }
}