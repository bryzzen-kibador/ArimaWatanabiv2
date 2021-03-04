import { Message, GuildMember } from "discord.js"
import { Manager, NodeOptions } from "erela.js"
import Client from "./Client"
import {config} from "dotenv"
config()

interface Timeouts {
    timeout: NodeJS.Timeout;
    message: Message
}

export default class ArimaMusic extends Manager {

    client: Client
    timeouts: Map<string, Timeouts>

    constructor(client: Client, nodes: NodeOptions[]) {
        super({
            nodes,
            send(id, payload) {
                const guild = client.guilds.cache.get(id)
                if (guild) guild.shard.send(payload)
            },
            autoPlay: true
        })

        this.client = client
        this.timeouts = new Map()

        const test = async () => {
            let player = this.create({
                guild: process.env.LGUILD as string,
                textChannel: process.env.LTEXT as string,
                voiceChannel: process.env.LVOICE as string,
                selfMute: true,
                selfDeafen: true
            })
    
            player.connect()
    
            const track = await this.search("https://www.youtube.com/watch?v=5JZt6Bz6Wg0", this.client.user)
    
            player.queue.add(track.tracks[0])
    
            if(!player.playing) player.play()
        }

        this.on("nodeConnect", async node => {
            console.log(`Lavalink conectado com sucesso!`)

            test()
        })

        this.on("nodeReconnect", async node => {
            console.log(`Lavalink reconectado!`)
        })

        this.on("nodeError", async (node, reason) => {
            console.error(`Deu pau:`, reason.message)
        })

        this.on("nodeDisconnect", async (node, reason) => {
            console.error(`Deu pau no bagulho mlk:`, reason.code)
        })

        this.on("trackStart", async (player, track) => {

            if(player.guild == process.env.LGUILD){
                setTimeout(() => {
                    player.pause(true)
                }, 3 * 1000)
                return;
            }

            if (!player.textChannel) return;

            let channel = this.client.channels.cache.get(player.textChannel)
            let guild = this.client.guilds.cache.get(player.guild)
            return channel?.send(guild.guildCache?.lang == "pt" ? `🎵 Música: \`${track.title}\` de: \`${track.author}\` começou a tocar!` : `🎵 Music: \`${track.title}\` by: \`${track.author}\` started!`).then(msg => msg.delete({timeout: 5000}))
        })

        this.on("queueEnd", async (player, track) => {
            if (!player.textChannel) return;

            let channel = this.client.channels.cache.get(player.textChannel)
            let guild = this.client.guilds.cache.get(player.guild)

            channel?.send(guild.guildCache?.lang == "pt" ? `🎶 Minha lista acabou!` : `🎶 The queue end!`).then(msg => msg.delete({timeout: 5000}))
            player.destroy()
        })

        this.on("trackError", async (player, track, payload) => {
            if (!player.textChannel) return;

            if (payload.error == 'Track information is unavailable.') {
                let channel = this.client.channels.cache.get(player.textChannel)
                let guild = this.client.guilds.cache.get(player.guild) 
                channel?.send(guild.guildCache?.lang == "pt" ? `❌ Essa música contem restrição de idade, não conseguirei tocar!` : `❌ This song contains age restriction, I will not be able to play!`).then(msg => msg.delete({timeout: 5000}))
             }else{
                let channel = this.client.channels.cache.get(player.textChannel)
                let guild = this.client.guilds.cache.get(player.guild) 
                channel?.send(payload.error).then(msg => msg.delete({timeout: 5000}))
             }

             if(player.guild == process.env.LGUILD){
                 this.destroy(player.guild)
                 
                 setTimeout(() => {
                     test()
                 }, 5 * 1000)
                 return;
             }

             this.destroy(player.guild)
        })
    }

    async hasDj(user: GuildMember){
        let dj = user.guild.guildCache?.dj || ""

        if(!dj || dj == "") return false;

        return user.roles.cache.has(dj)
    }

    init() {
        return super.init(`810127381683240980`)
    }
}