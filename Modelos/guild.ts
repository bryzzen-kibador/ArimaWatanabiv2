import {Schema, model, Document} from "mongoose"

interface Guild extends Document {
    _id: string;
    prefix?: string;
    lang: string;
    dj: string;
}

const guild = new Schema({
    _id: String,
    prefix: String,
    lang: String,
    dj: String
})

export default model<Guild>("Guild", guild)
