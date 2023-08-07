const { Client, Collection } = require('discord.js')
const SimplDB = require('simpl.db')

const fs = require('fs')

require('dotenv').config()
const client = new Client({intents: 3276799})

client.commands = new Collection()
client.database = new SimplDB()

client.login(process.env.TOKEN)

module.exports = client

fs.readdirSync('commands').forEach(subFolder => {
    fs.readdirSync(`commands/${subFolder}`).forEach(cmd => {
        const cmds = require(`./commands/${subFolder}/${cmd}`)
        client.commands.set(cmds.name, cmds)
        console.log(`${cmds.name} Carregado!`)
    })
})

fs.readdirSync('events').forEach(event => {
    const eventData = require(`./events/${event}`)
    client.on(eventData.name, eventData.run)
})
