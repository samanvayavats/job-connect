import { v2 as cloudinary } from 'cloudinary';

const uploadFileOnCloudinary = async (
    filePath,
    publicId,
    resourceType = "image"
) => {

     cloudinary.config({
        cloud_name: `${process.env.cloudinary_cloud_name}`,
        api_key: `${process.env.cloudinary_API_key}`,
        api_secret: `${process.env.cloudinary_API_secret}`
    });

    try {
        if (!filePath) return null;

        const response = await cloudinary.uploader.upload(filePath, {
            public_id: publicId,
            resource_type: resourceType,
            use_filename: true,
            unique_filename: false,
            overwrite: true,
        });

        return response;
    } catch (error) {
        console.log("Cloudinary Upload Error:", error);
        return null;
    }
};

const deleteFromcloudinary = async (public_id ,resource_type) => {
    cloudinary.config({
        cloud_name: `${process.env.cloudinary_cloud_name}`,
        api_key: `${process.env.cloudinary_API_key}`,
        api_secret: `${process.env.cloudinary_API_secret}`
    });


    // Delete a single image by public ID
   await cloudinary.uploader.destroy(public_id, {
        invalidate: true,
        resource_type: resource_type
    }, (error, result) => {
        console.log("result : ",result);
    });

}


export { uploadFileOnCloudinary, deleteFromcloudinary };
