import { Schema, model } from "mongoose";

const ReviewSchema = new Schema({
  authorName: String,
  rating: { type: Number, min: 1, max: 5 },
  body: String,
  createdAt: { type: Date, default: Date.now }
});

const ServiceSchema = new Schema(
  {
    // 🔥 NAME
    name_ar: { type: String, required: true },
    name_en: { type: String, required: true },

    // 🔥 SLUG
    slug: { type: String, required: true, unique: true },

    // 🔥 SHORT DESCRIPTION
    shortDescription_ar: { type: String },
    shortDescription_en: { type: String },

    // 🔥 FULL DESCRIPTION
    description_ar: { type: String },
    description_en: { type: String },

    // BASIC SERVICE INFO
    serviceType: String,
    price: Number,
    currency: String,

    // PROVIDER INFO
    provider_name: String,
    provider_url: String,
    provider_logo: String,
    provider_contactPhone: String,

    // AREA SERVED
    areaServed: [String],

    // IMAGES
    images: [
      {
        imageLink: { type: String, required: true },
        public_id: { type: String, required: true }
      }
    ],

    // REVIEWS
    reviews: [ReviewSchema],

    // AGGREGATE RATING
    aggregateRating_ratingValue: Number,
    aggregateRating_reviewCount: Number,
    customId: { type: String, unique: true },
    createdAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

export const serviceModel = model("Service", ServiceSchema);
