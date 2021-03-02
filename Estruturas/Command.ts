import Client from "./Client"

interface Options{
   name: string
   aliases: string[]
   usage?: usage
   category: string
}


interface usage {
    pt?: string;
    en?: string
}

export default class Command{
    client: Client;

    name: string;
    aliases: string[];
    usage?: usage | undefined;
    category: string;

    constructor(client: Client, options: Options) {
        this.client = client;

        this.name = options.name;
        this.aliases = options.aliases;
        this.usage = options.usage;
        this.category = options.category;
    }
}