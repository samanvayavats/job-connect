import { v2 as cloudinary } from 'cloudinary';

const uploadImageOnCloudinary = async (fileUrl, userName ,resource_type) => {
    cloudinary.config({
        cloud_name: `${process.env.cloudinary_cloud_name}`,
        api_key: `${process.env.cloudinary_API_key}`,
        api_secret: `${process.env.cloudinary_API_secret}`
    });

    const uploadResult = await cloudinary.uploader
        .upload(fileUrl, {
            public_id: `${userName}`,
            resource_type: resource_type
        })
        .catch((error) => {
            console.log(error);
        });

    return uploadResult;
};

export { uploadImageOnCloudinary };
