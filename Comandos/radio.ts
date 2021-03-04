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

        if (message.guild.fm && voice.channel.id !== message.guild?.me?.voice.channel?.id) return message.channel.send(message.guild.guildCache?.lang == "pt" ? `❌ Já estou tocando o rádio no momento!` : `❌ I'm playing the radio right now!`)

        if (player) return message.channel.send(message.guild.guidlCache?.lang == "pt" ? `❌ Estou tocando música no momento!` : `❌ I'm playing music right now`).then(msg => msg.delete({ timeout: 5000 }))

        const permissions = voice.channel.permissionsFor(this.client.user?.id as string)

        if (!permissions.has("CONNECT")) return message.channel.send(trans.connect).then(msg => msg.delete({ timeout: 5000 }))

        if (!permissions.has("SPEAK")) return message.channel.send(trans.speak).then(msg => msg.delete({ timeout: 5000 }))

        try {

            if (!args[0]) {

                let embed = new this.client.utils.embed()
                    .setTitle(`Radio FM`)
                    .setDescription(message.guild.guildCache?.lang == "pt" ? `${message.guild.fm == true ? `🎶 Sintonizado na radio: ${message.guild.fmRadio}` : `🎶 Tuned to the radio: ${message.guild.fmRadio}`}` : ``)
                    .addField(`[BR] Mundo Livre`, `${message.guild.guildCache?.prefix}radio MundoLivre`, true)
                    .addField(`[BR] Alternativa Livre`, `${message.guild.guildCache?.prefix}radio AlternativaLivre`, true)
                    .addField(`[BR] Canção Nova`, `${message.guild.guildCache?.prefix}radio CancaoNova`, true)
                    .addField(`[USA] Funk Corner Radio`, `${message.guild.guildCache?.prefix}radio FunkCornerRadio`, true)
                    .addField(`[PT] 4Drive Jazz`, `${message.guild.guildCache?.prefix}radio 4DriveJazz`, true)
                    .addField(`[PT] Cidade FM`, `${message.guild.guildCache?.prefix}radio CidadeFM`, true)
                    .addField(`[FR] Chillofi Radio`, `${message.guild.guildCache?.prefix}radio ChillofiRadio`, true)
                    .addField(`[RU] Relax-FM`, `${message.guild.guildCache?.prefix}radio Relax`, true)
                    .addField(`[MX] ¡Que Viva México!`, `${message.guild.guildCache?.prefix}radio Mexico`, true)
                    .addField(`[DE] 2000s on Radio on 2000s`, `${message.guild.guildCache?.prefix}radio 2000s`, true)
                    .addField(`[IN] Radio Sangam Ganesha`, `${message.guild.guildCache?.prefix}radio Sangam`, true)
                    .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))

                const msg = await message.channel.send(embed)
                return;
            }

            let link = ""
            let radio = ""


            switch (args[0].toLowerCase()) {
                case "mundolivre":
                    link = "http://up-continental.webnow.com.br/cultura.mp3"
                    radio = "MundoLivre"
                    break;
                case "funkcornerradio":
                    link = "https://ais-sa2.cdnstream1.com/2447_192.mp3"
                    radio = "FunkCornerRadio"
                    break;
                case "4drivejazz":
                    link = "http://radio.streemlion.com:1150/stream";
                    radio = "4DriveJazz"
                    break;
                case "chillofiradio":
                    link = "http://streaming.radionomy.com/JamendoLounge"
                    radio = "ChillofiRadio"
                    break;
                case "relax":
                    link = "http://ic4.101.ru:8000/stream/air/aac/64/200"
                    radio = "Relax-FM"
                    break;
                case "mexico":
                    link = "https://panel.retrolandigital.com:8160/listen";
                    radio = "Mexico"
                    break;
                case "cidadefm":
                    link = "http://195.23.102.207/cidadefm"
                    radio = "CidadeFM"
                    break;
                case "alternativalivre":
                    link = "http://node-17.zeno.fm/588dt1kykd0uv?rj-ttl=5&rj-tok=AAABd_lKfDsAKKWPWJgsbgZNLg"
                    radio = "AlternativaLivre"
                    break;
                case "cancaonova":
                    link = "https://rdcuritiba-lh.akamaihd.net/i/rdcuritiba_1@190572/master.m3u8";
                    radio = "CançãoNova";
                    break;
                case "2000s":
                    link = "http://0n-2000s.radionetz.de/0n-2000s.aac"
                    radio = "2000s"
                    break;
                case "sangam":
                    link = "http://radio2bindia.out.airtime.pro:8000/radio2bindia_a";
                    radio = "Sangam";
                    break;
                default:
                    message.channel.send(message.guild.guildCache?.lang == "pt" ? `❌ Não encontrei esse rádio!` : `❌ I didn't find this radio`)
                    break;
            }

            if (!link || link == "") return;

            const connection = await voice.channel.join()

            connection.play(link)
            message.guild.fmRadio = radio;
            message.guild.fm = true
            return message.channel.send(message.guild.guildCache?.lang == "pt" ? `🎶 Comecei a tocar!` : `🎶 I'm start to play!`)

        } catch (e) {
            console.log(e)
        }
    }
}