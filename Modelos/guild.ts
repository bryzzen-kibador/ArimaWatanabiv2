import {Schema, model, Document} from "mongoose"

interface Guild extends Document {
    id: string;
    prefix?: string;
    lang: string;
}

const guild = new Schema({
    id: String,
    prefix: String,
    lang: String
})

export default model<Guild>("Guild", guild)