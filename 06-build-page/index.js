const fs = require('fs/promises');
const path = require('path');

async function buildPage() {
  const projectDistDir = path.join(__dirname, 'project-dist');
  const templateFilePath = path.join(__dirname, 'template.html');
  const componentsDir = path.join(__dirname, 'components');
  const stylesDir = path.join(__dirname, 'styles');
  const assetsDir = path.join(__dirname, 'assets');

  await fs.mkdir(projectDistDir, { recursive: true });

  let template = await fs.readFile(templateFilePath, 'utf-8');
  const componentFiles = await fs.readdir(componentsDir);

  for (const file of componentFiles) {
    if (path.extname(file) === '.html') {
      const componentName = path.basename(file, '.html');
      const componentPath = path.join(componentsDir, file);
      const componentContent = await fs.readFile(componentPath, 'utf-8');
      template = template.replace(
        new RegExp(`{{${componentName}}}`, 'g'),
        componentContent,
      );
    }
  }

  await fs.writeFile(path.join(projectDistDir, 'index.html'), template);

  const styleFiles = await fs.readdir(stylesDir);
  const styles = [];
  for (const file of styleFiles) {
    if (path.extname(file) === '.css') {
      const stylePath = path.join(stylesDir, file);
      const styleContent = await fs.readFile(stylePath, 'utf-8');
      styles.push(styleContent);
    }
  }

  await fs.writeFile(path.join(projectDistDir, 'style.css'), styles.join('\n'));

  const copyAssets = async (src, dest) => {
    await fs.mkdir(dest, { recursive: true });
    const entries = await fs.readdir(src, { withFileTypes: true });

    for (const entry of entries) {
      const srcPath = path.join(src, entry.name);
      const destPath = path.join(dest, entry.name);

      if (entry.isDirectory()) {
        await copyAssets(srcPath, destPath);
      } else {
        await fs.copyFile(srcPath, destPath);
      }
    }
  };

  await copyAssets(assetsDir, path.join(projectDistDir, 'assets'));
}

buildPage().catch(console.error);
