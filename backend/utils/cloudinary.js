import { v2 as cloudinary } from 'cloudinary';

const initCloudinary = () => {
    const cloudinaryUrl = process.env.CLOUDINARY_URL;
    const cloudName = process.env.cloudinary_cloud_name || process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.cloudinary_API_key || process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.cloudinary_API_secret || process.env.CLOUDINARY_API_SECRET;

    if (!cloudinaryUrl && (!cloudName || !apiKey || !apiSecret)) {
        return false;
    }

    if (cloudinaryUrl) {
        cloudinary.config({ cloudinary_url: cloudinaryUrl });
    } else {
        cloudinary.config({
            cloud_name: cloudName,
            api_key: apiKey,
            api_secret: apiSecret
        });
    }
    return true;
};

const uploadFileOnCloudinary = async (filePath, publicId, resourceType = 'auto') => {
    if (!initCloudinary()) {
        console.warn('Cloudinary credentials missing in environment variables. Falling back to inline storage.');
        return null;
    }

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
    if (!initCloudinary()) return;

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
