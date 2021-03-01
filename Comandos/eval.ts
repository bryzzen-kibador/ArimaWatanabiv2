import {Message} from "discord.js"
import Command from "../Estruturas/Command"
import Client from "../Estruturas/Client"
import {inspect} from "util"

module.exports = class Ping extends Command{

    client: Client

    constructor(client: Client){
        super(client, {
            name: "eval",
            description: {pt: "Executa um código em mim!", en: "Run code on me!"},
            aliases: ["e", "ev"],
            category: "desenvolvedor"
        })
        this.client = client
    }

    async execute(message: Message, args: string[]){
      if(message.author?.id !== "719986033583849502") return;
      try{

        let evaled = await eval(args.join(" "))

        return message.channel.send(`\`\`\`js\n${inspect(evaled, {depth: 0})}\`\`\``)

      }catch(e){
        return message.channel.send(e)
      }
    }
}