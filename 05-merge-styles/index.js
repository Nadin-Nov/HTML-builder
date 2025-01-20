const fs = require('fs/promises');
const path = require('path');

async function mergeStyles() {
  const stylesDir = path.join(__dirname, 'styles');
  const outputFile = path.join(__dirname, 'project-dist', 'bundle.css');

  try {
    await fs.unlink(outputFile);
  } catch (error) {
    if (error.code !== 'ENOENT') {
      console.error('Error while deleting old bundle.css:', error);
      return;
    }
  }

  try {
    const files = await fs.readdir(stylesDir);
    const cssFiles = await Promise.all(
      files.map(async (file) => {
        const filePath = path.join(stylesDir, file);
        const stat = await fs.stat(filePath);
        return stat.isFile() && path.extname(file) === '.css' ? file : null;
      }),
    );

    const validCssFiles = cssFiles.filter((file) => file !== null);

    const styles = await Promise.all(
      validCssFiles.map(async (file) => {
        const filePath = path.join(stylesDir, file);
        const content = await fs.readFile(filePath, 'utf-8');
        return content;
      }),
    );

    await fs.writeFile(outputFile, styles.join('\n'));
    console.log('Styles have been merged into bundle.css');
  } catch (error) {
    console.error('Error while merging styles:', error);
  }
}

mergeStyles();
