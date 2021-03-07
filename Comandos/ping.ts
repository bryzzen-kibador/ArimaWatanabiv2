import {Message} from "discord.js"
import Command from "../Estruturas/Command"
import Client from "../Estruturas/Client"

module.exports = class Ping extends Command{

    client: Client

    constructor(client: Client){
        super(client, {
            name: "ping",
            aliases: ["pong"],
            category: "utilidade"
        })
        this.client = client
    }

    async execute(message: Message, args: string[]){
      return message.channel.send({embed: {description: ~~(this.client.ws.ping)+"ms", color: "#7b00ff"}})
    }
}