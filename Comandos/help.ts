import {Message, MessageEmbed} from "discord.js"
import Command from "../Estruturas/Command"
import Client from "../Estruturas/Client"
import Embed from "../Estruturas/Embed"

module.exports = class Eval extends Command{

    client: Client

    constructor(client: Client){
        super(client, {
            name: "help",
            description: {pt: "Recebe meus comandos!", en: "Get my commands!"},
            aliases: ["ajuda"],
            category: "utilidade"
        })
        this.client = client
    }

    async execute(message: Message, args: string[]){
      if(!args[0]){

        let prefix = message.guild?.guildCache()?.prefix || this.client.guildsCache.get(message.guild?.id as string)?.prefix

        let trad = await this.client.getTranslate(message.guild?.id as string, "help")
        let embed = new this.client.utils.embed()
        .setDescription(trad.description.replace("w!", prefix))
        embed.setTitle(trad.title)
        embed.addField(trad.fieldI, "\`\`\`"+this.client.commands.filter(f => f.category === "utilidade").map(f => f.name).join(", ")+"\`\`\`")


        return message.channel.send(embed)

      }else{

      }
    }
}