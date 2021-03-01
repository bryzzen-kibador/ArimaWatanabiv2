import {Client} from "discord.js"

module.exports = class Ready{
    client: Client

    constructor(client: Client){
        this.client = client
    }

    execute(){
        console.log(this.client.user?.username + " Iniciado com sucesso!")
    }
}