import Client from "../Estruturas/Client"

module.exports = class Ready{
    client: Client

    constructor(client: Client){
        this.client = client
    }

    async execute(){
        await this.client.loadGuilds()
<<<<<<< HEAD
        await this.client.status()
        console.log(this.client.user?.username + " Iniciado com sucesso!")
    }
}
=======
        console.log(this.client.user?.username + " Iniciado com sucesso!")
    }
}
>>>>>>> v1
