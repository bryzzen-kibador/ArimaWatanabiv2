import {Schema, model, Document} from "mongoose"

interface Guild extends Document {
    id: string;
    prefix?: string;
    lang: string;
    dj: string;
}

const guild = new Schema({
    id: String,
    prefix: String,
    lang: String,
    dj: String
})

<<<<<<< HEAD
export default model<Guild>("Guild", guild)
=======
export default model<Guild>("Guild", guild)
>>>>>>> v1
