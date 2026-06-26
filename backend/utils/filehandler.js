import fs from 'node:fs/promises';

async function deleteFile(filePath) {
  try {
    await fs.unlink(filePath);
  } catch (error) {
    console.error(`Error deleting file: ${error.message}`);
  }
}

export {deleteFile};
