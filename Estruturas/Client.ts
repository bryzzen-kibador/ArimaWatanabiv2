import discord, { MessageEmbed } from "discord.js"
import fs from "fs"
import gDb from "../Modelos/guild"
import Embed from "./Embed";
import Leven from "../Extra/levenshtein"
import { config } from "dotenv"
config()

import lavalink from "./Lavalink"
import { NodeOptions } from "erela.js";

interface utils {
    mstodate: (time: number) => object;
    embed: typeof Embed;
    leven: (src: string, target: string) => number;
    mstohour: (time: number) => string;
}

interface CommandOptions {
    name: string
    description: string
    aliases: string[]
    usage?: string
    category: string
}

interface Command extends CommandOptions {
    execute: (message: discord.Message, args: string[]) => void;
}

export default class Arima extends discord.Client {

    utils: utils
    commands: Array<Command>;
    gDB: typeof gDb;
    music: lavalink | undefined;

    constructor(options: discord.ClientOptions) {
        super(options)

        function mstodate(time: number) {
            time = Math.round(time / 1000);
            const s = time % 60,
                m = Math.floor((time / 60) % 60),
                h = Math.floor((time / 60 / 60) % 24),
                d = Math.floor(time / 60 / 60 / 24);

            return {
                days: d,
                hours: h,
                minutes: m,
                seconds: s
            }
        }

        this.gDB = gDb;

        function mstohour(time: number) {
            time = Math.round(time / 1000)
            const s = time % 60,
                m = ~~((time / 60) % 60),
                h = ~~(time / 60 / 60);

            return h
                ? `${String(h).length === 2 ? h : `0${h}`}:${String(m).length === 2 ? m : `0${m}`}:${String(s).length === 2 ? s : `0${s}`}`
                : `${String(m).length === 2 ? m : `0${m}`}:${String(s).length === 2 ? s : `0${s}`}`;
        }


        this.utils = {
            mstodate: mstodate,
            embed: Embed,
            leven: Leven,
            mstohour: mstohour
        }

        this.commands = []


    }

    async getTranslate(id: string, local: string) {
        let lang = await this.guilds.cache.get(id)?.guildCache?.lang || "en"

        let json = require(`../translate/${lang}/commands.json`)

        return json[local]
    }

    login(token: any) {
        return super.login(token)
    }

    loadEvents(): void {
        fs.readdirSync("./Eventos").forEach(file => {
            const evento = new (require(`../Eventos/${file}`))(this)
            const name = file.split(".")[0]

            if (name === "ready") {
                super.once("ready", (...args) => evento.execute(...args))
            } else {
                super.on(name, (...args) => evento.execute(...args))
            }
        })
    }

    loadCommands(): void {
        fs.readdirSync("./Comandos").forEach(file => {
            const comando = new (require(`../Comandos/${file}`))(this)
            this.commands.push(comando)
        })
    }

    async loadGuilds(): Promise<void> {
        const guildsData = await this.gDB.find({})

        this.guilds.cache.map(async (guild) => {
            const gData = guildsData.find(g => g.id === guild.id)

            guild.guildCache = {
                prefix: gData?.prefix || "w!",
                lang: gData?.lang || "en",
                dj: gData?.dj || ""
            }
        })
    }

    async connectLavalink(): Promise<void> {
        const nodes: NodeOptions[] = [
            {
                identifier: "Node1",
                host: process.env.HOST as string,
                port: Number(process.env.LPORT),
                password: process.env.LPASS as string
            }
        ]
        this.music = new lavalink(this, nodes)

        this.music.init()

        this.on("raw", d => this.music?.updateVoiceState(d))
    }
}