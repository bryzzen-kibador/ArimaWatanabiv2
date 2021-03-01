import {Message} from "discord.js"
import Client from "../Estruturas/Client"
import Guild from "../Modelos/guild"

module.exports = class Ready{
    client: Client

    constructor(client: Client){
        this.client = client
    }

    async execute(message: Message) {
      let guild = this.client.guildsCache.get(message.guild?.id as string)

      let prefix = guild?.prefix || "w!"

      if(!message.content.startsWith(prefix)) return;
      if(message.content === prefix) return;

      let cmdName = message.content.split(" ")[0].slice(prefix.length)
      let args = message.content.split(" ").slice(1)

      let cmd = this.client.commands.find(f => f.aliases.concat([f.name]).includes(cmdName.toLowerCase()))

      let translate = await this.client.getTranslate(message.guild?.id as string, "error")
      if(!cmd) return message.channel.send(`${translate.cmd}`)

      await cmd.execute(message, args)

    }
}