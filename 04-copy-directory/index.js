const fs = require('fs/promises');
const path = require('path');

async function copyDir() {
  const sourceDir = path.join(__dirname, 'files');
  const targetDir = path.join(__dirname, 'files-copy');

  await fs.mkdir(targetDir, { recursive: true });

  const sourceFiles = await fs.readdir(sourceDir);
  const targetFiles = await fs.readdir(targetDir);

  await Promise.all(
    targetFiles.map(async (file) => {
      if (!sourceFiles.includes(file)) {
        const targetFile = path.join(targetDir, file);
        await fs.unlink(targetFile);
      }
    }),
  );

  await Promise.all(
    sourceFiles.map(async (file) => {
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
