import { Schema,model } from "mongoose";

const blogsSchema = new Schema({
    title: {
        ar:{ type: String, required: true },
        en:{ type: String, required: true }
    },
    content: {
        ar:{ type: String, required: true },
        en:{ type: String, required: true }
    },
    author: { 
        ar:{ type: String, required: true },
        en:{ type: String, required: true }
     },
    autherJobTitle: { 
        ar:{ type: String, required: true },
        en:{ type: String, required: true }
     },
     category: {
         ar:{ type: String, required: true },
         en:{ type: String, required: true }
        },
    authorImage: {
            imageLink:{type: String, required: true},
            public_id:{type: String, required: true},
        },
    readTime: { type: Number, required: true },
    images: [{
        imageLink:{type: String, required: true},
        public_id:{type: String, required: true},
    }],
    customId: { type: String, required: true},
},{ timestamps: true })

export const BlogsModel = model("Blogs", blogsSchema);