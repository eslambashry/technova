import { careerModel } from "../../DB/models/careersModel.js";
import CustomError from "../../utilities/customError.js";



export const createCareer = async (req, res) => {
    try {
        const { title_ar, title_en, department_ar, department_en,location_ar,location_en,type_ar,type_en,description_ar,description_en, requirements_ar, requirements_en,responsibilities_ar,responsibilities_en,howToApply_ar, howToApply_en } = req.body;
        
        const newCareer = new careerModel(
            {
                title_ar,
                title_en,
                department_ar,
                department_en,
                location_ar,
                location_en,
                type_ar,
                type_en,
                description_ar,
                description_en,
                requirements_ar,
                requirements_en,
                responsibilities_ar,
                responsibilities_en,
                howToApply_ar,
                howToApply_en
            }
        );
        
        await newCareer.save();
        
        res.status(201).json({ message: "Career created successfully", career: newCareer });
    } catch (error) {
        res.status(500).json({ message: "Error creating career", error: error.message });
    }
};

export const getCareers = async (req, res) => {
    try {
        const careers = await careerModel.find();   
        

        if (careers.length === 0) {
            return res.status(404).json({ message: "No careers found" });
        }

        res.status(200).json({ message: "Careers retrieved successfully", careers });
    } catch (error) {
        res.status(500).json({ message: "Error retrieving careers", error: error.message });
    }
};

export const getCareerById = async (req, res) => {
    try {
        const { id } = req.params;
        const career = await careerModel.findById(id);
        if (!career) {
            return next(new CustomError("Career not found", 404));
        }

        res.status(200).json({
            success: true,
            message: "Career retrieved successfully",
            career
        });
    } catch (error) {
       return next(new CustomError("Error retrieving career", 500));
    }
};

export const updateCareer = async (req,res) =>{

    try {
        const { id } = req.params;
        const updatedData = req.body;
        const updatedCareer = await careerModel.findByIdAndUpdate(id, updatedData, { new: true });

        if (!updatedCareer) {
            return next(new CustomError("Career not found", 404));
        }
        res.status(200).json({
            success: true,
            message: "Career updated successfully",
            career: updatedCareer
        });
    } catch (error) {
       return next(new CustomError("Error updating career", 500));
    }
}

export const deleteCareer = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedCareer = await careerModel.findByIdAndDelete(id);  

        if (!deletedCareer) {
            return next(new CustomError("Career not found", 404));
        }   

        res.status(200).json({
            success: true,
            message: "Career deleted successfully",
            deletedCareer 
        });

    } catch (error) {
       return next(new CustomError("Error deleting career", 500));
    }
};