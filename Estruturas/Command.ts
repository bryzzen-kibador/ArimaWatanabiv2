import Client from "./Client"

interface Options{
   name: string
   description: description
   aliases: string[]
   usage?: string
   category: string
}

interface description {
    en: string;
    pt: string;
}

export default class Command{
    client: Client;

    name: string;
    description: description;
    aliases: string[];
    usage?: string;
    category: string;

    constructor(client: Client, options: Options) {
        this.client = client;

        this.name = options.name;
        this.description = options.description || {pt: "Sem descrição!", en: "No description"};
        this.aliases = options.aliases;
        this.usage = options.usage;
        this.category = options.category;
    }
}