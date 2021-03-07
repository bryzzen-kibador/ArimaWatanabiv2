import { Message } from "discord.js"
import Command from "../Estruturas/Command"
import Client from "../Estruturas/Client"
import { inspect } from "util"

module.exports = class Eval extends Command {

  client: Client

  constructor(client: Client) {
    super(client, {
      name: "eval",
      aliases: ["e", "ev"],
      category: "desenvolvedor"
    })
    this.client = client
  }

  async execute(message: Message, args: string[]) {
    if (message.author?.id !== "719986033583849502") {
      let translate = await this.client.getTranslate(message.guild?.id as string, "error")
      let cmds: string[] = [];
      let qual = ""
      let prefix = message.guild.guildCache?.prefix
      let cmdName = "eval"

      this.client.commands.filter(f => f.category != "desenvolvedor").forEach((cmd) => {
        cmds = cmds.concat(cmd.aliases.concat([cmd.name]))

        let distancia = Infinity

        cmds.forEach(cmd => {
          let leven = this.client.utils.leven(cmdName, cmd)

          if (leven < distancia) {
            qual = cmd;
            distancia = leven
          }
        })
      })

      message.channel.send(translate.cmd.replace("w!ping", `\`${prefix}${qual}\``));
      return;
    }
    try {

      let evaled = await eval(args.join(" "))

      return message.channel.send(`\`\`\`js\n${inspect(evaled, { depth: 0 })}\`\`\``)

    } catch (e) {
      return message.channel.send(`\`\`\`js\n${inspect(e, {depth: 0})}\`\`\``)
    }
  }
}
