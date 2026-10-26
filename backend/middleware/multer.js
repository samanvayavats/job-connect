import multer from 'multer';

// Memory storage: completely eliminates disk operations, ENOENT errors, and cloud directory permission issues
const storage = multer.memoryStorage();

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB maximum file size
    }
});

export default upload;
