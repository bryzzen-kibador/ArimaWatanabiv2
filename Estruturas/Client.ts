import discord from "discord.js"
import fs from "fs"
import gDb from "../Modelos/guild"

interface utils {
    mstodate: (time: number) => object;
}

interface GuildCache {
    prefix?: string;
    lang: string;
}

interface CommandOptions{
    name: string
    description: string
    aliases: string[]
    usage?: string
    category: string
}

interface Command extends CommandOptions {
    execute: (message: discord.Message, args: string[]) => void;
}

export default class Arima extends discord.Client{

     utils: utils
     commands: Array<Command>;
     gDB: typeof gDb;
     guildsCache: Map<string, GuildCache>;

    constructor(options: discord.ClientOptions){
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
        this.guildsCache = new Map()

        this.utils = {
            mstodate: mstodate
        }
        
        this.commands = []

    }

    async getTranslate(id: string, local: string){
      let lang = this.guildsCache.get(id)?.lang || "en"

      let json = require(`../translate/${lang}/commands.json`)

      return json[local]
    }

    login(token: any){
        return super.login(token)
    }

    loadEvents(): void {
       fs.readdirSync("./Eventos").forEach(file => {
            const evento = new (require(`../Eventos/${file}`))(this)
            const name = file.split(".")[0]

            if(name === "ready"){
                super.once("ready", (...args) => evento.execute(...args))
            }else{
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

        this.guilds.cache.map((guild) => {
            const gData = guildsData.find(g => g.id === guild.id)

            this.guildsCache.set(guild.id, {
                prefix: gData?.prefix || "w!",
                lang: gData?.lang || "en"
            })
        })
    }
}