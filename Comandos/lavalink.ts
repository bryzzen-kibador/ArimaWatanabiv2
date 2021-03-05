import { Message, MessageEmbed } from "discord.js"
import Command from "../Estruturas/Command"
import Client from "../Estruturas/Client"

module.exports = class Lavalink extends Command {

    client: Client

    constructor(client: Client) {
        super(client, {
            name: "lavalink",
            aliases: ["lava"],
            category: "musica"
        })
        this.client = client
    }

    async execute(message: Message, args: string[]) {
        let node = this.client?.music?.nodes.first()?.stats
        let uptime = this.client.utils.mstodate(node?.uptime as number)
        let embed = new this.client.utils.embed()
            .setTitle(`🎶 Lavalink \`${this.client.music?.nodes.first()?.options.identifier}\``)
<<<<<<< HEAD
            .addField(`<:lab_poarr:689926691342385198> Players:`, `\`` + node?.players + `\``)
=======
            .addField(`<:load:488757308248293396> Players:`, `\`` + node?.players + `\``)
>>>>>>> v1
            .addField(`<:lab_daora:568569334134472734> Uptime:`, `${uptime.days}D/${uptime.hours}H/${uptime.minutes}M`)
            .addField(`<:lab_on:811281161892265995> RAM:`, `${Math.floor(node?.memory.used / 1024 / 1024)}/${Math.floor(node?.memory.reservable / 1024 / 1024)}MB`)
            .addField(`<:lab_selfie:783901503395069962> CPU:`, `
> Cores: \`${node?.cpu.cores}\`
> Lavalink Usage: \`${node?.cpu.lavalinkLoad.toFixed(2)}%\`
> System Usage: \`${node?.cpu.systemLoad.toFixed(2)}%\``)

        return message.channel.send(embed)
    }
<<<<<<< HEAD
}
=======
}
>>>>>>> v1
