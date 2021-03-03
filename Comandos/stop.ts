import {Message} from "discord.js"
import Command from "../Estruturas/Command"
import Client from "../Estruturas/Client"
import { Player } from "erela.js"

module.exports = class Play extends Command{

    client: Client

    constructor(client: Client){
        super(client, {
            name: "stop",
            aliases: ["s", "parar"],
            category: "musica",
        })
        this.client = client
    }

    async execute(message: Message, args: string[]){
        
      const voice = message.member?.voice

      let trans = await this.client.getTranslate(message.guild?.id as string, "play")

      if(!voice?.channel) return message.channel.send(trans.voiceChannel)

      const player = this.client.music.players.get(message.guild?.id as string)

      if(!player && message.guild.fm){
          await message.guild?.me?.voice.channel?.leave()
          this.client.fm = false
          return message.channel.send(await this.client.getTranslate(message.guild?.id as string, "stop"))
      }

      if(player && player.voiceChannel !== voice.channel.id) return message.channel.send(trans.myVoiceChannel)

      try{

        if(!player?.playing) return message.channel.send(await this.client.getTranslate(message.guild?.id as string, "stopP"))
        if(message.guild.guildCache?.dj && await this.client.music?.hasDj(message.member) || player.queue.current?.requester == message.author || voice.channel.members.filter(f => !f.user.bot).size == 1){
        player?.stop()
        player?.destroy()
        }else{
            return message.channel.send(message.guild.guildCache?.lang == "pt" ? `❌ Apenas um DJ ou quem requisitou a música pode para-lá!` : `❌ Only a DJ or whoever ordered the music can stop it!`)
        }

        return message.channel.send(await this.client.getTranslate(message.guild?.id as string, "stop"))

      }catch(e){
          return message.channel.send(e)
      }
      
    }
}