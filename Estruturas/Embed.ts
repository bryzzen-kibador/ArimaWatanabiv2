import { ColorResolvable, MessageEmbed } from "discord.js";

export default class Embed extends MessageEmbed {
    constructor(){
      super()
      this.setColor("#7b00ff")
    }
}