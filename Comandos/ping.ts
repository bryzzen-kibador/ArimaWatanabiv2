import {Message} from "discord.js"
import Command from "../Estruturas/Command"
import Client from "../Estruturas/Client"

module.exports = class Eval extends Command{

    client: Client

    constructor(client: Client){
        super(client, {
            name: "ping",
            description: {pt: "Recebe a minha lâtencia!", en: "Get my latency"},
            aliases: ["pong"],
            category: "utilidade"
        })
        this.client = client
    }

    async execute(message: Message, args: string[]){
      return message.channel.send(~~(this.client.ws.ping)+"ms")
    }
}