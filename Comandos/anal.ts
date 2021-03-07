import {Message} from "discord.js"
import Command from "../Estruturas/Command"
import Client from "../Estruturas/Client"
import neko from "nekos.life"
const h = new neko()

module.exports = class Ping extends Command{

    client: Client

    constructor(client: Client){
        super(client, {
            name: "anal",
            aliases: ["asshole"],
            category: "nsfw"
        })
        this.client = client
    }

    async execute(message: Message, args: string[]){
        if(!message.channel.nsfw) return message.channel.send(message.guild.guildCache?.lang == "pt" ? `❌ Não posso enviar comandos nsfw nesse canal!` : `❌ I cannot send nsfw commands on that channel!`)
        let embed = new this.client.utils.embed()
        embed.setImage((await h.nsfw.anal()).url)
        return message.channel.send(embed)
    }
}