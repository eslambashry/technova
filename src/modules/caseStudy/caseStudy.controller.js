import { caseStudyModel } from "../../DB/models/caseStudyModel.js";
import { customAlphabet } from 'nanoid'
const nanoid = customAlphabet('1234567890abcdefghijklmnopqrstuvwxyz', 5)
import CustomError from "../../utilities/customError.js";
import imagekit, { destroyImage } from "../../utilities/imagekitConfigration.js";

export const createCaseStudy = async (req, res, next) => {
  console.log(req.body);
  
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
    } = req.body;

    if (!title_ar || !title_en || !institute_ar || !institute_en ||
      !description_ar || !description_en || !category_ar || !category_en) {
      return next(new CustomError("All fields are required", 400));
    }

    // --- Build status array ---
let status = [];

const values = req.body["status.value"];
const labelsEn = req.body["status.label_en"];
const labelsAr = req.body["status.label_ar"];



if (!values || !labelsEn || !labelsAr) {
  return next(new CustomError("Status fields are required", 400));
}
console.log(values.length);

const valuesArr = Array.isArray(values) ? values : [values];
const labelsEnArr = Array.isArray(labelsEn) ? labelsEn : [labelsEn];
const labelsArArr = Array.isArray(labelsAr) ? labelsAr : [labelsAr];

console.log(valuesArr.length);

for (let i = 0; i < valuesArr.length; i++) {
  status.push({
    value: valuesArr[i],
    label_en: labelsEnArr[i],
    label_ar: labelsArArr[i],
  });
}

    const customId = nanoid();

    // Validate images
    const files = req.files;
    if (!files || files.length === 0) {
      return next(new CustomError("At least 1 image is required", 400));
    }

    // Upload multiple images
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

    // CREATE Case Study Document
    const newCaseStudy = new caseStudyModel({
      title_ar,
      title_en,
      institute_ar,
      institute_en,
      description_ar,
      description_en,
      category_ar,
      category_en,
      status: status,
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
