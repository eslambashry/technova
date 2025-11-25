import { Schema } from "mongoose";


const caseStudySchema = new Schema({
    title_ar: { type: String, required: true },
    title_en: { type: String, required: true },
    institute_ar: { type: String, required: true },
    institute_en: { type: String, required: true },
    description_ar: { type: String, required: true },
    description_en: { type: String, required: true },
    stats: [
            { value: "10x", label: "Traffic Capacity" },
            { value: "99.99%", label: "Uptime" },
            { value: "40%", label: "Cost Savings" },
        ],
        status: { type: String, required: true },
        customId: { type: String},
    image: {
            imageLink:{type: String, required: true},
            public_id:{type: String, required: true},
        },
},{ timestamps: true })