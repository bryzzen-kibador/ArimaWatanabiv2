import { Message, MessageAttachment, MessageEmbed, Guild } from "discord.js"
import Client from "../Estruturas/Client"

module.exports = class Msg {
  client: Client

  constructor(client: Client) {
    this.client = client
  }

  async execute(message: Message) {
    if(message.author.bot) return
    
    let prefix = message.guild?.guildCache().then(o => o?.prefix) || this.client.guildsCache.get(message.guild?.id as string)?.prefix

    if([this.client.user?.toString(), `<@!${this.client.user?.id}>`].includes(message.content)){
      let embed = new this.client.utils.embed()
      .setAuthor(message.author.username, message.author.displayAvatarURL({dynamic: true}))
      .setDescription((await this.client.getTranslate(message.guild?.id as string, "mention")).replace("w!", prefix))
      .setFooter(message.author.username, message.author.displayAvatarURL({dynamic: true}))
      return message.channel.send(embed)
    }


    if (!message.content.startsWith(prefix) && !message.content.startsWith("arima ")) return;
    if (message.content === prefix) return;
    if (message.content === "arima ") return;

    let cmdName = "";
    let args = message.content.split(" ").slice(1)

    if (message.content.startsWith(prefix)) cmdName = message.content.split(" ")[0].slice(prefix.length)
    if (message.content.startsWith("arima ")) {
      cmdName = message.content.split(" ")[1]
      args = args.slice(1)
    }
    if (cmdName === "") return;


    let cmd = this.client.commands.find(f => f.aliases.concat([f.name]).includes(cmdName.toLowerCase()))

    let translate = await this.client.getTranslate(message.guild?.id as string, "error")
    if (!cmd) return message.channel.send(`${translate.cmd}`)

    await cmd.execute(message, args)

  }
}