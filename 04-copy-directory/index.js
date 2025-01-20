const fs = require('fs/promises');
const path = require('path');

async function copyDir() {
  const sourceDir = path.join(__dirname, 'files');
  const targetDir = path.join(__dirname, 'files-copy');

  await fs.mkdir(targetDir, { recursive: true });

  const files = await fs.readdir(sourceDir);

  await Promise.all(
    files.map(async (file) => {
      const sourceFile = path.join(sourceDir, file);
      const targetFile = path.join(targetDir, file);
      await fs.copyFile(sourceFile, targetFile);
    }),
  );

  console.log('Copying completed!');
}

copyDir().catch((error) =>
  console.error('Error while copying the directory:', error),
);
