import { APIMessage, Structures } from "discord.js";
import gDb from "../Modelos/guild"

class Guild extends Structures.get("Guild"){ // Copy D4rk
    async getCache(){
        let guild = await gDb.findOne({id: this.id})

        if(guild){
            return guild
        }else{
            return {prefix: "w!", lang: "en"}
        }
    }
}

Structures.extend("Guild", () => Guild)