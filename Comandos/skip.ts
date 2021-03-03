import { Message } from "discord.js"
import Command from "../Estruturas/Command"
import Client from "../Estruturas/Client"

module.exports = class Play extends Command {

    client: Client

    constructor(client: Client) {
        super(client, {
            name: "skip",
            aliases: ["pular"],
            category: "musica",
            usage: { en: `[Amount]`, pt: "[Quantia]" }
        })
        this.client = client
    }

    async execute(message: Message, args: string[]) {

        const voice = message.member?.voice

        let trans = await this.client.getTranslate(message.guild?.id as string, "play")

        if (!voice?.channel) return message.channel.send(trans.voiceChannel)

        const player = this.client.music?.players.get(message.guild?.id as string)

        if (player && player.voiceChannel !== voice.channel.id) return message.channel.send(trans.myVoiceChannel)

        try {

            if (args[0]) {
                let quantia = args[0]
                if (!quantia || isNaN(parseInt(quantia)) || parseInt(quantia) <= 0 || parseInt(quantia) == Infinity) return message.channel.send(message.guild.guildCache?.lang == "pt" ? `❌ Número Inválido` : `❌ Invalid Number`)
                let quant = parseInt(quantia)
                if (message.author == player?.queue.current?.requester || voice.channel.members.filter(f => !f.user.bor).size == 1) {
                    player?.stop(quant)

                    if (!player?.queue[0]) {
                        player?.destroy()
                        return message.channel.send(message.guild.guildCache?.lang == "pt" ? `🎶 A lista de música acabou!` : `🎶 The queue is end!`).then(msg => msg.delete({ timeout: 5000 }))
                    }

                    return message.channel.send(message.guild.guildCache?.lang == "pt" ? `🎶 Músicas Puladas!` : `🎶 Skipped!`)
                } else {
                    if (message.guild.guidCache?.dj) {
                        if (await this.client.music?.hasDj(message.member)) {
                            player?.stop(quant)

                            if (!player?.queue[0]) {
                                player?.destroy()
                                return message.channel.send(message.guild.guildCache?.lang == "pt" ? `🎶 A lista de música acabou!` : `🎶 The queue is end!`).then(msg => msg.delete({ timeout: 5000 }))
                            }

                            return message.channel.send(message.guild.guildCache?.lang == "pt" ? `🎶 Músicas Puladas!` : `🎶 Skipped!`)
                        } else {
                            return message.channel.send(message.guild.guildCache?.lang == "pt" ? `❌ Apenas um DJ ou quem requisitou a música pode pula-lá!` : `❌ Only a DJ or whoever ordered the music can skip it!`).then(msg => msg.delete({ timeout: 5000 }))
                        }
                    } else {
                        player?.stop(quant)

                        if (!player?.queue[0]) {
                            player?.destroy()
                            return message.channel.send(message.guild.guildCache?.lang == "pt" ? `🎶 A lista de música acabou!` : `🎶 The queue is end!`).then(msg => msg.delete({ timeout: 5000 }))
                        }

                        return message.channel.send(message.guild.guildCache?.lang == "pt" ? `🎶 Músicas Puladas!` : `🎶 Skipped!`).then(msg => msg.delete({ timeout: 5000 }))

                    }
                }
            }

            if (!player?.playing) return message.channel.send(await this.client.getTranslate(message.guild?.id as string, "stopP"))
            if (message.guild.guildCache?.dj) {
                if (message.author == player.queue.current?.requester || voice.channel.members.filter(f => !f.user.bot).size == 1) {
                    player.stop()

                    if (!player.queue[0]) {
                        player.destroy()
                        return message.channel.send(message.guild.guildCache?.lang == "pt" ? `🎶 A lista de música acabou!` : `🎶 The queue is end!`).then(msg => msg.delete({ timeout: 5000 }))
                    }

                    return message.channel.send(message.guild.guildCache?.lang == "pt" ? `🎶 Música Pulada!` : `🎶 Skipped!`)
                } else {
                    if (await this.client.music?.hasDj(message.member)) {
                        player.stop()

                        if (!player.queue[0]) {
                            player.destroy()
                            return message.channel.send(message.guild.guildCache?.lang == "pt" ? `🎶 A lista de música acabou!` : `🎶 The queue is end!`).then(msg => msg.delete({ timeout: 5000 }))
                        }

                        return message.channel.send(message.guild.guildCache?.lang == "pt" ? `🎶 Música Pulada!` : `🎶 Skipped!`)

                    } else {
                        return message.channel.send(message.guild.guildCache?.lang == "pt" ? `❌ Apenas um DJ ou quem requisitou a música pode pula-lá!` : `❌ Only a DJ or whoever ordered the music can skip it!`).then(msg => msg.delete({ timeout: 5000 }))
                    }
                }
            } else {
                player.stop()

                if (!player.queue[0]) {
                    player.destroy()
                    return message.channel.send(message.guild.guildCache?.lang == "pt" ? `🎶 A lista de música acabou!` : `🎶 The queue is end!`).then(msg => msg.delete({ timeout: 5000 }))
                }

                return message.channel.send(message.guild.guildCache?.lang == "pt" ? `🎶 Música Pulada!` : `🎶 Skipped!`).then(msg => msg.delete({ timeout: 5000 }))

            }


        } catch (e) {
            return message.channel.send(e)
        }

    }
}