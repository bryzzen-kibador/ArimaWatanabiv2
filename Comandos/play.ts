import {Message} from "discord.js"
import Command from "../Estruturas/Command"
import Client from "../Estruturas/Client"
import { Player } from "erela.js"

module.exports = class Play extends Command{

    client: Client

    constructor(client: Client){
        super(client, {
            name: "play",
            aliases: ["tocar"],
            category: "musica",
            usage: {en: `<Music>`, pt: `<Música>`}
        })
        this.client = client
    }

    async execute(message: Message, args: string[]){
        
      const voice = message.member?.voice

      let trans = await this.client.getTranslate(message.guild?.id as string, "play")

      if(!voice?.channel) return message.channel.send(trans.voiceChannel).then(msg => msg.delete({timeout: 5000}))

      const player = this.client.music.players.get(message.guild?.id as string)

      if(player && player.voiceChannel !== voice.channel.id) return message.channel.send(trans.myVoiceChannel).then(msg => msg.delete({timeout: 5000}))

      const permissions = voice.channel.permissionsFor(this.client.user?.id as string)

      if(!permissions.has("CONNECT")) return message.channel.send(trans.connect).then(msg => msg.delete({timeout: 5000}))

      if(!permissions.has("SPEAK")) return message.channel.send(trans.speak).then(msg => msg.delete({timeout: 5000}))

      if(args.length < 1) {
          if(message.content.split(" ")[0] === "arima"){
            return message.channel.send(`❌ Use: ${message.guild.guildCache?.prefix}${message.content.split(" ")[1]} ${this.usage[message.guild.guildCache?.lang]}`).then(msg => msg.delete({timeout: 5000}))
          }else{
            return message.channel.send(`❌ Use: ${message.guild.guildCache?.prefix}${message.content.split(" ")[0].slice(message.guild.guildCache?.prefix.length)} ${this.usage[message.guild.guildCache?.lang]}`).then(msg => msg.delete({timeout: 5000}))
          }
      }
      try{

        let create = (): Player => {
            return this.client.music.create({
                guild: message.guild?.id as string,
                textChannel: message.channel.id,
                voiceChannel: voice.channel?.id as string,
                selfDeafen: true
            })
        }

        const result = await this.client.music.search(args.join(" "), message.author)

        if(result.loadType == "LOAD_FAILED"){
            return message.channel.send(trans.errorLoading).then(msg => msg.delete({timeout: 5000}))
        }

        if(result.loadType == "NO_MATCHES"){
            return message.channel.send(trans.errorFind).then(msg => msg.delete({timeout: 5000}))
        }

        const MPlayer = player || create()

        if(MPlayer.state == "DISCONNECTED"){
                if(!permissions.has("MANAGE_CHANNELS") && voice.channel.userLimit && voice.channel.members.size >= voice.channel.userLimit){
                    MPlayer.destroy()
                    return message.channel.send(trans.fullChannel).then(msg => msg.delete({timeout: 5000}))
                }
                MPlayer.connect()
        }

        if(result.loadType == "PLAYLIST_LOADED"){
            const playlist = result.playlist;

            result.tracks.map(track => {
                MPlayer.queue.add(track)
            })

            if(!MPlayer.playing){
                MPlayer.play()
            }
            message.channel.send(message.guild.guildCache?.lang === "pt" ? `🎶 Playlist carregada! Duração: \`${this.client.utils.mstohour(playlist?.duration as number)}\`` : `🎶 Playlist loaded! Duration: \`${this.client.utils.mstohour(playlist?.duration as number)}\``).then(msg => msg.delete({timeout: 5000}))
            return;
        }else{
            const tracks = result.tracks

            MPlayer.queue.add(tracks[0])

            if(!MPlayer.playing){
                MPlayer.play()
            }else{
                return message.channel.send(message.guild.guildCache?.lang === "pt" ? `🎶 Adicionei ao queue!` : `🎶 I added to queue!`).then(msg => msg.delete({timeout: 5000}))
            }
        }


      }catch(e){
          return message.channel.send(e)
      }
      
    }
}