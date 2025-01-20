const fs = require('fs/promises');
const path = require('path');

async function displayFileInfo() {
  try {
    const folderPath = path.join(__dirname, 'secret-folder');
    const files = await fs.readdir(folderPath, { withFileTypes: true });

    for (const file of files) {
      if (file.isFile()) {
        const filePath = path.join(folderPath, file.name);
        const stats = await fs.stat(filePath);
        const fileSize = stats.size;
        const extname = path.extname(file.name).slice(1);
        const filename = path.basename(file.name, path.extname(file.name));

        console.log(`${filename} - ${extname} - ${fileSize}b`);
      }
    }
  } catch (error) {
    console.error('Error reading directory:', error);
  }
}

displayFileInfo();
