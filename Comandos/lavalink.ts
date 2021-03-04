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
            .setTitle(`Lavalink \`${this.client.music?.nodes.first()?.options.identifier}\``)
            .addField(`Players:`, `\`` + node?.players + `\``)
            .addField(`Uptime:`, `${uptime.days}D/${uptime.hours}H/${uptime.minutes}M`)
            .addField(`RAM:`, `${Math.floor(node?.memory.used / 1024 / 1024)}/${Math.floor(node?.memory.reservable / 1024 / 1024)}MB`)
            .addField(`CPU:`, `
> Cores: \`${node?.cpu.cores}%\`
> Lavalink Usage: \`${node?.cpu.lavalinkLoad.toFixed(2)}%\`
> System Usage: \`${node?.cpu.systemLoad.toFixed(2)}%\``)

        return message.channel.send(embed)
    }
}