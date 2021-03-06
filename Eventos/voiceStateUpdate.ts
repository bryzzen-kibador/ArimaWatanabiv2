import Client from "../Estruturas/Client"
import { VoiceState } from "discord.js"
import {config} from "dotenv"
config()

module.exports = class VoiceStateUpdate {
    client: Client

    constructor(client: Client) {
        this.client = client
    }

    async execute(oldState: VoiceState, newState: VoiceState) {
        if (!oldState.channel && newState.channel) {
            //entrou
            const player = this.client.music?.players.get(oldState.guild.id);

            const fm = newState.guild.fm

            if (!fm && !player) {
                return;
            }

            if (player) {

                if (this.client.music?.timeouts.has(newState.guild.id) && newState.channel.id == player.voiceChannel) {
                    player.pause(false)
                    const data = this.client.music.timeouts.get(newState.guild.id)
                    if (!data) return;
                    clearTimeout(data.timeout)
                    data.message.delete().catch(() => { });
                    this.client.music.timeouts.delete(newState.guild.id)
                }

            }
        } else if (oldState.channel && !newState.channel) {
            const player = this.client.music?.players.get(newState.guild.id);

            let guild = oldState.guild

            const fm = guild?.fm

            if (!fm && !player) {
                return;
            }

            if (player) {
                if (oldState.member?.id === this.client.user?.id) {
                    if(oldState.guild.id == process.env.LGUILD) return;
                    let channel = this.client.channels.cache.get(player?.textChannel as string)
                    channel?.send(guild.guildCache?.lang === "pt" ? `❌ Eu fui desconectada então apaguei o queue` : `❌ I was disconnected so I deleted the queue`)
                    player?.destroy()

                    const data = this.client.music?.timeouts.get(guild?.id as string)
                    if (!data) return;
                    clearTimeout(data.timeout)
                    data.message.delete().catch(() => { })
                    this.client.music?.timeouts.delete(guild?.id as string)
                    return;
                }

                if (oldState.channel.id == player.voiceChannel && oldState.channel.members.filter(f => !f.user.bot).size == 0) {
                    player.pause(true)
                    const msg = await this.client.channels.cache.get(player?.textChannel as string)?.send(guild.guildCache?.lang === "pt" ? `❌ Fiquei sozinha, se ninguem aparecer dentro de 1 minuto vou meter o pé` : `❌ I was alone, if nobody shows up within 1 minute I’ll put my foot in`)
                    const timeout = setTimeout(() => {
                        this.client.channels.cache.get(player?.textChannel as string)?.send(guild.guildCache?.lang === "pt" ? `❌ Fiquei 1 minutos sozinha então parei de tocar` : `❌ I was 1 minute alone so I stopped playing`)
                        player.destroy()
                        this.client.music?.timeouts.get(guild?.id as string)?.message.delete().catch(() => { })
                        this.client.music?.timeouts.delete(guild?.id as string)
                    }, 1 * 60 * 1000)

                    this.client.music?.timeouts.set(guild?.id as string, { timeout, message: msg })
                }
            }

            if(fm){
                if (oldState.member.id == this.client.user?.id){
                oldState.guild.fm = false
                return;
                }

                if(oldState.channel == oldState.guild.me?.voice.channel && oldState.channel.members.filter(f => !f.user.bot).size == 0){
                oldState.guild.conn.disconnect().then(() => {})
                oldState.channel.leave()
                oldState.guild.fm = false
                return;
                }
            }
        }

    }
}
