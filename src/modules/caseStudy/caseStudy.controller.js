import { caseStudyModel } from "../../DB/models/caseStudyModel.js";
import { customAlphabet } from 'nanoid'
const nanoid = customAlphabet('1234567890abcdefghijklmnopqrstuvwxyz', 5)
import CustomError from "../../utilities/customError.js";
import imagekit, { destroyImage } from "../../utilities/imagekitConfigration.js";

export const createCaseStudy = async (req, res, next) => {
  try {
    const {
      title_ar,
      title_en,
      institute_ar,
      institute_en,
      description_ar,
      description_en,
      category_ar,
      category_en,
      status
    } = req.body;

    // Validate required fields
    if (!title_ar || !title_en || !institute_ar || !institute_en ||
      !description_ar || !description_en || !category_ar || !category_en) {
      return next(new CustomError("All fields are required", 400));
    }

    // --- FIXED STATUS HANDLING ---
    if (!Array.isArray(status) || status.length === 0) {
      return next(new CustomError("Status fields are required", 400));
    }

    const customId = nanoid();

    // Validate images
    const files = req.files;
    if (!files || files.length === 0) {
      return next(new CustomError("At least 1 image is required", 400));
    }

    // Upload images
    const uploadedImages = [];

    for (const file of files) {
      const uploadResult = await imagekit.upload({
        file: file.buffer,
        fileName: file.originalname,
        folder: `${process.env.PROJECT_FOLDER}/Case_Study/${customId}`,
      });

      uploadedImages.push({
        imageLink: uploadResult.url,
        public_id: uploadResult.fileId,
      });
    }

    // Create Case Study
    const newCaseStudy = new caseStudyModel({
      title_ar,
      title_en,
      institute_ar,
      institute_en,
      description_ar,
      description_en,
      category_ar,
      category_en,
      status,           // 👈 Already correct
      customId,
      images: uploadedImages,
    });

    await newCaseStudy.save();

    res.status(201).json({
      success: true,
      message: "Case study created successfully",
      data: newCaseStudy,
    });

  } catch (error) {
    next(error);
  }
};


export const getAllCaseStudies = async (req, res, next) => {
    const caseStudies = await caseStudyModel.find();
    return res.status(200).json({
        success: true,
        caseStudies
    });
}

export const getCaseStudyById = async (req, res, next) => {
    const id = req.params.id    
    const caseStudy = await caseStudyModel.findById(id)
    return res.status(200).json({
        success: true,
        caseStudy
    });
}

export const updateCaseStudy = async (req, res, next) => {

    const { title_ar, title_en, institute_ar, institute_en, description_ar, description_en, status,category_ar,category_en } = req.body;
    const id = req.params.id;   
    const caseStudy = await caseStudyModel.findById(id);
    if (!caseStudy) {
        return next(new CustomError("Case Study not found", 404));
    }   
    if (title_ar) caseStudy.title_ar = title_ar;
    if (title_en) caseStudy.title_en = title_en;
    if (institute_ar) caseStudy.institute_ar = institute_ar;
    if (institute_en) caseStudy.institute_en = institute_en;
    if (description_ar) caseStudy.description_ar = description_ar;
    if (description_en) caseStudy.description_en = description_en;
    if (status) caseStudy.status = JSON.parse(status);
    if (category_ar) caseStudy.category_ar = category_ar;
    if (category_en) caseStudy.category_en = category_en

    if(req.files && req.files.length > 0){
        // Delete old image from ImageKit
        await imagekit.deleteFile(caseStudy.images.public_id);
        const file = req.files[0];
        const uploadResult = await imagekit.upload({
          file: file.buffer,
            fileName: file.originalname,
            folder: `${process.env.PROJECT_FOLDER}/Case_Study/${caseStudy.customId}`,
        });
        caseStudy.images = { 
            imageLink: uploadResult.url,
            public_id: uploadResult.fileId,
        };
    }
    
    await caseStudy.save();

    return  res.status(200).json({
        success: true,
        message: "Case Study updated successfully",
        caseStudy
    });
}

export const deleteCaseStudy = async (req, res, next) => {
  try {
    const id = req.params.id;
    const caseStudy = await caseStudyModel.findById(id);

    if (!caseStudy) {
      return next(new CustomError("Case Study not found", 404));
    }

    // Delete all images from ImageKit
    for (const img of caseStudy.images) {
      await destroyImage(img.public_id);
    }

    // Delete DB record
    await caseStudyModel.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Case Study deleted successfully",
    });

  } catch (error) {
    next(error);
  }
};


export const multyDeleteCaseStudy = async (req, res, next) => {
  const { ids } = req.body; // Expecting an array of IDs in the request body
  if (!Array.isArray(ids) || ids.length === 0) {
    return next(new CustomError("Please provide an array of IDs to delete", 400));
  }
  const caseStudies = await caseStudyModel.find({ _id: { $in: ids } });
  if (caseStudies.length === 0) {
    return next(new CustomError("No Case Studies found for the provided IDs", 404));
  }
  for (const caseStudy of caseStudies) {
    caseStudy.images.forEach(async (image) => {
      await destroyImage(image.public_id);
    });
    await caseStudyModel.findByIdAndDelete(caseStudy._id);
  }
  return res.status(200).json({
    success: true,
    message: "caseStudies deleted successfully",
  });
}

export const getAllArabicCaseStudies = async (req, res, next) => {
    const caseStudies = await caseStudyModel.find().select('title_ar institute_ar description_ar category_ar images status createdAt updatedAt');
    return res.status(200).json({
        success: true,
        caseStudies
    });
}

export const getAllEnglishCaseStudies = async (req, res, next) => {
    const caseStudies = await caseStudyModel.find().select('title_en institute_en description_en category_en images status createdAt updatedAt');
    return res.status(200).json({
        success: true,
        caseStudies
    });
}
