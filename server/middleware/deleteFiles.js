const fs = require('fs').promises;
const path = require('path');

exports.deletePackageImages = async (images = []) => {
  if (!Array.isArray(images)) {
    console.warn('Images is not an array:', images);
    return;
  }

  for (const url of images) {
    try {
      const filename = url.split('/').pop();
      
      if (!filename) {
        console.warn('Could not extract filename from URL:', url);
        continue;
      }

      // Try first with the 'uploads' directory (as seen in your error messages)
      let filePath = path.join(__dirname, '..', 'uploads', 'package', filename);
      
      // Check if file exists
      let fileExists = await fs.access(filePath).then(() => true).catch(() => false);
      
      // If not found, try with 'upload' directory
      if (!fileExists) {
        filePath = path.join(__dirname, '..', 'upload', 'package', filename);
        fileExists = await fs.access(filePath).then(() => true).catch(() => false);
      }
      
      if (fileExists) {
        await fs.unlink(filePath);
        console.log(`✅ Deleted file: ${filePath}`);
      } else {
        console.warn(`⚠️ File does not exist in either path: ${filename}`);
      }
    } catch (err) {
      console.warn(`⚠️ Could not delete file - ${err.message}`, url);
    }
  }
};