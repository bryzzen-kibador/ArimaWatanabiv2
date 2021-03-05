import { Message, MessageEmbed } from "discord.js"
import Command from "../Estruturas/Command"
import Client from "../Estruturas/Client"
import djso from "@discordjs/opus"

module.exports = class Radio extends Command {

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
                    .setDescription(message.guild.guildCache?.lang == "pt" ? message.guild.fm ? `🎶 Sintonizado na radio: ${message.guild.fmRadio}` : `` : message.guild.fm ? `🎶 Tuned to the radio: ${message.guild.fmRadio}` : ``)
                    .addField(`[BR] Mundo Livre`, `Tags: Rock, Pop, Funk`, true)
                    .addField(`[BR] Alternativa Livre`, `Tags: Free, Alternative `, true)
                    .addField(`[BR] Canção Nova`, `Tags: Religion, Catholic`, true)
                    .addField(`[USA] Funk Corner Radio`, `Tags: Funk, R&B, Disco, 70s, 80s, Soul, Black Music, Music ...`, true)
                    .addField(`[PT] 4Drive Jazz`, `Tags: Jazz Fusion, Nu-Jazz, Dmooth Jazz`, true)
                    .addField(`[PT] Cidade FM`, `Tags: Rock, Pop, Funk`, true)
                    .addField(`[FR] Chillofi Radio`, `Tags: Easy Listening, Urban, Hiphop, Lofi, Chill, Chillout`, true)
                    .addField(`[RU] Relax-FM`, `Tags: Rock, Pop, Funk`, true)
                    .addField(`[MX] ¡Que Viva México!`, `Tags: Mexican Music`, true)
                    .addField(`[DE] 2000s on Radio on 2000s`, `Tags: Adult Contemporary, Urban, R'n'B, Hiphop, Dance, Rock, Hits, Pop, 2000er, 2000s`, true)
                    .addField(`[IN] Radio Sangam Ganesha`, `Tags: Mantra, Spiritual`, true)
                    .setFooter(`Use: ${message.guild.guildCache?.prefix}radio <Radio>`, message.author.displayAvatarURL({ dynamic: true }))

                const msg = await message.channel.send(embed)
                return;
            }

            let link = ""
            let radio = ""
            let r = args.join(" ")


            switch (r.replace(/\s/g, "").toLowerCase()) {
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
<<<<<<< HEAD
            message.guild.conn = connection
=======
>>>>>>> v1
            return message.channel.send(message.guild.guildCache?.lang == "pt" ? `🎶 Comecei a tocar!` : `🎶 I'm start to play!`)

        } catch (e) {
            console.log(e)
        }
    }
<<<<<<< HEAD
}
=======
}
>>>>>>> v1
