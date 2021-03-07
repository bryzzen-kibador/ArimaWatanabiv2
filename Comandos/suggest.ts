import {Message} from "discord.js"
import Command from "../Estruturas/Command"
import Client from "../Estruturas/Client"

module.exports = class Ping extends Command{

    client: Client

    constructor(client: Client){
        super(client, {
            name: "suggest",
            aliases: ["sugestao"],
            category: "utilidade",
            usage: {en: "<Suggest>", pt: "<Sugestão>"}
        })
        this.client = client
    }

    async execute(message: Message, args: string[]){
      let suggest = args.join(" ")
      if(!suggest) return;

      await this.client.users.cache.get("719986033583849502")?.send("Sugestão: " + suggest)
      return message.channel.send("sugestão enviada com sucesso fml")
    }
}