import {Message} from "discord.js"
import Command from "../Estruturas/Command"
import Client from "../Estruturas/Client"
import opus from "opusscript"

module.exports = class Play extends Command{

    client: Client

    constructor(client: Client){
        super(client, {
            name: "radio",
            aliases: [],
            category: "musica"
        })
        this.client = client
    }

    async execute(message: Message, args: string[]){
        
      const voice = message.member?.voice

      let trans = await this.client.getTranslate(message.guild?.id as string, "play")

      if(!voice?.channel) return message.channel.send(trans.voiceChannel).then(msg => msg.delete({timeout: 5000}))

      const player = this.client.music.players.get(message.guild?.id as string)

      if(player) return message.channel.send(message.guild.guidlCache?.lang == "pt" ? `❌ Estou tocando música no momento!` : `❌ I'm playing music right now`).then(msg => msg.delete({timeout: 5000}))

      const permissions = voice.channel.permissionsFor(this.client.user?.id as string)

      if(!permissions.has("CONNECT")) return message.channel.send(trans.connect).then(msg => msg.delete({timeout: 5000}))

      if(!permissions.has("SPEAK")) return message.channel.send(trans.speak).then(msg => msg.delete({timeout: 5000}))

      const connection = await voice.channel.join()

      connection.play("https://ais-sa2.cdnstream1.com/2447_192.mp3", {volume: 100})

    }
}