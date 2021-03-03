import { Message, MessageEmbed } from "discord.js"
import Command from "../Estruturas/Command"
import Client from "../Estruturas/Client"
import djso from "@discordjs/opus"

module.exports = class Play extends Command {

    client: Client

    constructor(client: Client) {
        super(client, {
            name: "radio",
            aliases: [],
            category: "musica"
        })
        this.client = client
    }

    async execute(message: Message, args: string[]) {

        const voice = message.member?.voice

        let trans = await this.client.getTranslate(message.guild?.id as string, "play")

        if (!voice?.channel) return message.channel.send(trans.voiceChannel).then(msg => msg.delete({ timeout: 5000 }))

        const player = this.client.music.players.get(message.guild?.id as string)

        if (message.guild.fm) return message.channel.send(message.guild.guildCache?.lang == "pt" ? `❌ Já tocando o rádio no momento!` : `❌ I'm playing the radio right now!`)

        if (player) return message.channel.send(message.guild.guidlCache?.lang == "pt" ? `❌ Estou tocando música no momento!` : `❌ I'm playing music right now`).then(msg => msg.delete({ timeout: 5000 }))

        const permissions = voice.channel.permissionsFor(this.client.user?.id as string)

        if (!permissions.has("CONNECT")) return message.channel.send(trans.connect).then(msg => msg.delete({ timeout: 5000 }))

        if (!permissions.has("SPEAK")) return message.channel.send(trans.speak).then(msg => msg.delete({ timeout: 5000 }))

        try {

            if (!args[0]) {

                let embed = new this.client.utils.embed()
                    .setTitle(`Radio FM`)
                    .addField(`[BR] Mundo Livre`, `${message.guild.guildCache?.prefix}radio MundoLivre`, true)
                    .addField(`[USA] Funk Corner Radio`, `${message.guild.guildCache?.prefix}radio FunkCornerRadio`, true)
                    .addField(`[PT] 4Drive Jazz`, `${message.guild.guildCache?.prefix}radio 4DriveJazz`, true)
                    .addField(`[FR] Chillofi Radio`, `${message.guild.guildCache?.prefix}radio ChillofiRadio`, true)
                    .addField(`[RU] Relax-FM`, `${message.guild.guildCache?.prefix}radio Relax`, true)
                    .addField(`[MX] ¡Que Viva México!`, `${message.guild.guildCache?.prefix}radio mexico`, true)
                    .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))

                const msg = await message.channel.send(embed)
                return;
            }

            let link = ""


            switch (args[0].toLowerCase()) {
                case "mundolivre":
                    link = "http://up-continental.webnow.com.br/cultura.mp3"
                    break;
                case "funkcornerradio":
                    link = "https://ais-sa2.cdnstream1.com/2447_192.mp3";
                    break;
                case "4drivejazz":
                    link = "http://radio.streemlion.com:1150/stream";
                    break;
                case "chillofiradio":
                    link = "http://streaming.radionomy.com/JamendoLounge"
                    break;
                case "relax":
                    link = "http://ic4.101.ru:8000/stream/air/aac/64/200"
                    break;
                case "mexico":
                    link = "https://panel.retrolandigital.com:8160/listen";
                    break;
                default:
                    message.channel.send(message.guild.guildCache?.lang == "pt" ? `❌ Não encontrei esse rádio!` : `❌ I didn't find this radio`)
                    break;
            }

            if (!link || link == "") return;

            const connection = await voice.channel.join()

            connection.play(link)
            message.guild.fm = true
            return message.channel.send(message.guild.guildCache?.lang == "pt" ? `🎶 Comecei a tocar!` : `🎶 I'm start to play!`)

        } catch (e) {
            console.log(e)
        }
    }
}