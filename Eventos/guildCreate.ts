import Client from "../Estruturas/Client"
import discord from "discord.js"

module.exports = class Ready{
    client: Client

    constructor(client: Client){
        this.client = client
    }

    execute(guild: discord.Guild){
        this.client.guildsCache.set(guild.id, {
            lang: "en",
            prefix: "w!"
        })
    }
}