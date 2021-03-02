import Client from "../Estruturas/Client"
import discord from "discord.js"

module.exports = class Ready{
    client: Client

    constructor(client: Client){
        this.client = client
    }

    execute(guild: discord.Guild){
        guild.guildCache = {
            lang: "en",
            prefix: "w!",
            dj: ""
        }
    }
}