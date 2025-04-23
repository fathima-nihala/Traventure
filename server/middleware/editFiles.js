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