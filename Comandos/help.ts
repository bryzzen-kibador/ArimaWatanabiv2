import { Message, MessageEmbed } from "discord.js"
import Command from "../Estruturas/Command"
import Client from "../Estruturas/Client"
import Embed from "../Estruturas/Embed"

module.exports = class Help extends Command {

  client: Client

  constructor(client: Client) {
    super(client, {
      name: "help",
      aliases: ["ajuda"],
      category: "utilidade",
      usage: {pt: "[Comando]", en: "[Command]"}
    })
    this.client = client
  }

  async execute(message: Message, args: string[]) {
    if (!args[0]) {

      let prefix = message.guild.guildCache?.prefix || "w!"

      let trad = await this.client.getTranslate(message.guild?.id as string, "help")
      let embed = new this.client.utils.embed()
        .setDescription(trad.description.replace("w!", prefix))
      embed.setTitle(trad.title)
      embed.addField(trad.fieldI, "\`\`\`" + this.client.commands.filter(f => f.category === "utilidade").map(f => f.name).join(", ") + "\`\`\`")
      embed.addField(trad.fieldM, "\`\`\`" + this.client.commands.filter(f => f.category === "musica").map(f => f.name).join(", ")+"\`\`\`")
      if(message.guild.guildCache?.nsfw){
        embed.addField(trad.fieldN, "\`\`\`" + this.client.commands.filter(f => f.category == "nsfw").join(", ") + "\`\`\`")
      }
      return message.channel.send(embed)

    } else {

      let trad = await this.client.getTranslate(message.guild?.id as string, "help")
      let cmd = this.client.commands.find(f => f.aliases.concat([f.name]).includes(args[0].toLowerCase()))
      if (!cmd || cmd.category === "desenvolvedor") {
        let prefix = await message.guild.guildCache.prefix || "w!"
        let embed = new this.client.utils.embed()
          .setDescription(trad.description.replace("w!", prefix))
        embed.setTitle(trad.title)
        embed.addField(trad.fieldI, "\`\`\`" + this.client.commands.filter(f => f.category === "utilidade").map(f => f.name).join(", ") + "\`\`\`")


        return message.channel.send(embed)
      }

      if(cmd.category == "nsfw" && !message.guild.guildCache?.nsfw){
        return message.channel.send({embed: {description: trad.nonsfw, color: "#7b00ff"}})
      }

      let embed = new this.client.utils.embed()
        .setTitle(trad.title)
        .addField(trad.name, "\`"+cmd.name+"\`")
        .addField(trad.alias, "\`"+cmd.aliases.join(", ")+"\`")
        .addField(trad.usage, cmd.usage ? "\`"+message.guild.guildCache?.prefix+cmd.name+" "+cmd.usage[message.guild.guildCache?.lang]+"\`" : "\`"+message.guild.guildCache.prefix+cmd.name+"\`")
        .setFooter(message.author.username, message.author.displayAvatarURL({dynamic: true}))
        return message.channel.send(embed)
    }
  }
}