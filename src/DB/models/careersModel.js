import { model, Schema } from "mongoose";

const careersSchema = new Schema({
    title_ar: { type: String },
    title_en: { type: String },
    department_ar: { type: String },
    department_en: { type: String },
    location_ar: { type: String },
    location_en: { type: String },
    type_ar: { type: String },
    type_en: { type: String },
    description_ar: { type: String },
    description_en: { type: String },
    requirements_ar: { type: String },
    requirements_en: { type: String },
    responsibilities_ar: { type: String },
    responsibilities_en: { type: String },
    howToApply_ar: { type: String },
    howToApply_en: { type: String },
},{ timestamps: true })

export const careerModel = model("Career",careersSchema)