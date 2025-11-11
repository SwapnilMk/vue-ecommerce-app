const cloudinary = require("cloudinary");
const dotenv = require("dotenv");

dotenv.config();

cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadToCloudinary = async (filePath, folder = "ecommerce") => {
    try {
        const result = await cloudinary.v2.uploader.upload(filePath, {
            folder,
            resource_type: "image",
        });
        return result; 
    } catch (error) {
        throw new Error(error.message);
    }
};

export const deleteFromCloudinary = async (publicId) => {
    return cloudinary.v2.uploader.destroy(publicId);
};

module.exports = {
    cloudinary: cloudinary.v2,
    uploadToCloudinary,
    deleteFromCloudinary
};