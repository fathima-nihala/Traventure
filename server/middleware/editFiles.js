const fs = require('fs'); 
const path = require('path'); 

exports.deleteOldUserFile = async (oldFilePath) => {
    if (oldFilePath) {
        const fullPath = path.join(__dirname, '..', 'upload', path.basename(oldFilePath));
        try {
            if (fs.existsSync(fullPath)) { 
                await fs.promises.unlink(fullPath); 
            }
        } catch (error) {
            console.error('Error deleting old file:', error);
        }
    }
};


exports.deleteOldPackages = async (oldFileUrl) => {
    try {
      const filename = oldFileUrl.split('/').pop();
      const fullPath = path.join(__dirname, '..', 'upload', 'package', filename);
      
      if (fs.existsSync(fullPath)) {
        await fs.promises.unlink(fullPath);
        console.log(`✅ Deleted file: ${fullPath}`);
      } else {
        console.warn(`⚠️ File not found: ${fullPath}`);
      }
    } catch (error) {
      console.error(`❌ Failed to delete ${oldFileUrl}:`, error.message);
    }
  };