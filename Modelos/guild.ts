import {Schema, model, Document} from "mongoose"

interface Guild extends Document {
    prefix?: string;
    lang: string;
    dj: string;
}

const guild = new Schema({
    prefix: String,
    lang: String,
    dj: String
})

export default model<Guild>("Guild", guild)
