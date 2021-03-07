import {Message} from "discord.js"
import Command from "../Estruturas/Command"
import Client from "../Estruturas/Client"
import neko from "nekos.life"
const h = new neko()

module.exports = class Anal extends Command{

    client: Client

    constructor(client: Client){
        super(client, {
            name: "gasm",
            aliases: ["orgasmo"],
            category: "nsfw"
        })
        this.client = client
    }

    async execute(message: Message, args: string[]){
        if(!message.guild.guildCache?.nsfw) return;
        if(!message.channel.nsfw) return message.channel.send(message.guild.guildCache?.lang == "pt" ? `❌ Não posso enviar comandos nsfw nesse canal!` : `❌ I cannot send nsfw commands on that channel!`)
        let embed = new this.client.utils.embed()
        let url = (await h.nsfw.anal()).url
        embed.setTitle(`😈 Orgasm`)
        embed.setURL(url)
        embed.setImage(url)
        return message.channel.send(embed)
    }
}