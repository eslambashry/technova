import slugify from "slugify";
import { customAlphabet } from 'nanoid'
const nanoid = customAlphabet('1234567890abcdefghijklmnopqrstuvwxyz', 5)
import { serviceModel } from "../../DB/models/servicesModel.js";
import CustomError from "../../utilities/customError.js";
import imagekit from "../../utilities/imagekitConfigration.js";

export const createService = async (req, res, next) => {
  
    console.log(req.body);

    const {
      name_ar,
      name_en,
      shortDescription_ar,
      shortDescription_en,
      description_ar,
      description_en,
      serviceType,
      price,
      currency,
      provider_name,
      provider_url,
      provider_logo,
      provider_contactPhone,
      areaServed,
      aggregateRating_ratingValue,
      aggregateRating_reviewCount
    } = req.body;
    
    // 🔥 Validate required fields
    if (!name_ar || !name_en) {
      return next(new CustomError("Arabic and English names are required", 400));
    }

    if (!description_ar || !description_en) {
      return next(new CustomError("Descriptions (AR + EN) are required", 400));
    }

    const imageFiles = req.files || [];
    if (imageFiles.length === 0) {
      return next(new CustomError("At least one image is required", 400));
    }

    // 🔥 Create slug from English name
    const slug = slugify(name_en, { replacement: '_', lower: true });

    // 🔥 Prepare upload folder
    const customId = nanoid();
    const uploadedImages = [];

    // 🔥 Upload images to ImageKit
    for (const file of imageFiles) {
      const uploadResult = await imagekit.upload({
        file: file.buffer,
        fileName: file.originalname,
        folder: `${process.env.PROJECT_FOLDER}/Services/${customId}`,
      });

      uploadedImages.push({
        imageLink: uploadResult.url,
        public_id: uploadResult.fileId,
      });
    }

    // 🔥 Create new service document
    const newService = new serviceModel({
      name_ar,
      name_en,
      slug,
      shortDescription_ar,
      shortDescription_en,
      description_ar,
      description_en,
      serviceType,
      price,
      currency,
      provider_name,
      provider_url,
      provider_logo,
      provider_contactPhone,
      areaServed: Array.isArray(areaServed) ? areaServed : [areaServed],
      images: uploadedImages,
      aggregateRating_ratingValue: aggregateRating_ratingValue || 0,
      aggregateRating_reviewCount: aggregateRating_reviewCount || 0,
      customId,
    });

    await newService.save();

    return res.status(201).json({
      success: true,
      message: "Service created successfully",
      service: newService,
    });
};
export const getAllServices = async (req, res, next) => {
  try {
    const services = await serviceModel.find().sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      services,
    });
  } catch (err) {
    next(err);
  } 
};