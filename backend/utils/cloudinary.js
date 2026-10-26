import { v2 as cloudinary } from 'cloudinary';

const uploadFileOnCloudinary = async (filePath, publicId, resourceType = 'auto') => {
    const cloudName = process.env.cloudinary_cloud_name;
    const apiKey = process.env.cloudinary_API_key;
    const apiSecret = process.env.cloudinary_API_secret;

    if (!cloudName || !apiKey || !apiSecret) {
        console.warn('Cloudinary credentials missing in environment variables. Falling back to local/inline storage.');
        return null;
    }

    cloudinary.config({
        cloud_name: cloudName,
        api_key: apiKey,
        api_secret: apiSecret
    });

    try {
        if (!filePath) return null;

        const response = await cloudinary.uploader.upload(filePath, {
            public_id: publicId,
            resource_type: resourceType || 'auto',
            use_filename: true,
            unique_filename: true,
            overwrite: true
        });

        return response;
    } catch (error) {
        console.error('Cloudinary Upload Error:', error.message);
        return null;
    }
};

const deleteFromcloudinary = async (public_id, resource_type = 'auto') => {
    const cloudName = process.env.cloudinary_cloud_name;
    const apiKey = process.env.cloudinary_API_key;
    const apiSecret = process.env.cloudinary_API_secret;

    if (!cloudName || !apiKey || !apiSecret) return;

    cloudinary.config({
        cloud_name: cloudName,
        api_key: apiKey,
        api_secret: apiSecret
    });

    try {
        await cloudinary.uploader.destroy(public_id, {
            invalidate: true,
            resource_type: resource_type || 'auto'
        });
    } catch (error) {
        console.warn('Cloudinary Delete Warning:', error.message);
    }
};

export { uploadFileOnCloudinary, deleteFromcloudinary };
