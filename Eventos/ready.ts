import Client from "../Estruturas/Client"

module.exports = class Ready{
    client: Client

    constructor(client: Client){
        this.client = client
    }

    async execute(){
        await this.client.loadGuilds()
        console.log(this.client.user?.username + " Iniciado com sucesso!")
    }
}