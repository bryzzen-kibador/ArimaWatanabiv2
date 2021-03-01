import Arima from "./Estruturas/Client"
import dotenv from "dotenv"
dotenv.config()
import fs from "fs"

const client = new Arima({})

client.login(process.env.TOKEN)

import mongoose from "mongoose"

mongoose.connect(process.env.LINK as string, {
    useUnifiedTopology: true,
    useNewUrlParser: true
}).then(() => {
    console.log(`Conectado no mongo db com sucesso manin`)
}).catch((e) => {
    console.error("Erro ao conectar", e)
})

client.loadEvents()
client.loadCommands()
client.loadGuilds()