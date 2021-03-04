import { Message, MessageAttachment, MessageEmbed, Guild } from "discord.js"
import Client from "../Estruturas/Client"

module.exports = class Msg {
  client: Client

  constructor(client: Client) {
    this.client = client
  }

  async execute(message: Message) {
    if(message.author.bot) return
    
    let prefix = await message.guild.guildCache?.prefix || "w!"

    if([this.client.user?.toString(), `<@!${this.client.user?.id}>`].includes(message.content)){
      let embed = new this.client.utils.embed()
      .setAuthor(message.author.username, message.author.displayAvatarURL({dynamic: true}))
      .setDescription((await this.client.getTranslate(message.guild?.id as string, "mention")).replace("w!", prefix))
      .setFooter(message.author.username, message.author.displayAvatarURL({dynamic: true}))
      return message.channel.send(embed)
    }


    if (!message.content.startsWith(prefix) && !message.content.startsWith("arima ") && ![`${this.client.user?.toString()} `, `<@!${this.client.user?.id}> `].includes(message.content)) return;
    if (message.content === prefix) return;
    if (message.content === "arima ") return;
    if(message.content === `${this.client.user?.toString()} `) return;
    if(message.content === `<@!${this.client.user?.id}> `) return

    let cmdName = "";
    let args = message.content.split(" ").slice(1)

    if (message.content.startsWith(prefix)) cmdName = message.content.split(" ")[0].slice(prefix.length)
    if (message.content.startsWith("arima ")) {
      cmdName = message.content.split(" ")[1]
      args = args.slice(1)
    }
    if([`${this.client.user?.toString()} `, `<@!${this.client.user?.id}> `].includes(message.content)){
      cmdName = message.content.split(" ")[1]
      args = args.slice(1)

      Object.keys(message.mentions).map((f: any) => {
        if(!message.mentions.has(f)) return;

        message.mentions[f].delete([...message.mentions[f].keys()][0])
      })
    }
    if (cmdName === "") return;


    let cmd = this.client.commands.find(f => f.aliases.concat([f.name]).includes(cmdName.toLowerCase()))

    let translate = await this.client.getTranslate(message.guild?.id as string, "error")
    if (!cmd){
      let cmds: string[] = [];
      let qual = ""

      this.client.commands.filter(f => f.category !== "desenvolvedor").forEach((cmd) => {
        if(cmd.category === "desenvolvedor"){
          if(message.author.id == "719986033583849502"){
            cmds = cmds.concat(cmd.aliases.concat([cmd.name]))
          }
        }else{
          cmds = cmds.concat(cmd.aliases.concat([cmd.name]))
        }

        let distancia = Infinity

        cmds.forEach(cmd => {
          let leven = this.client.utils.leven(cmdName, cmd)

          if(leven < distancia){
            qual = cmd;
            distancia = leven
          }
        })
      })

      message.channel.send(translate.cmd.replace("w!ping", `\`${prefix}${qual}\``));
      return;
    }

    await cmd?.execute(message, args)

  }
}