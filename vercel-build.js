import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory (ESM equivalent of __dirname)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Run the standard build
console.log('Building the Vite application...');
execSync('npm run build', { stdio: 'inherit' });

// Verify build output
console.log('Verifying build output...');
const distDir = path.join(__dirname, 'dist');

if (!fs.existsSync(distDir)) {
  console.error('Error: dist directory does not exist after build');
  process.exit(1);
}

// Check for index.html
if (!fs.existsSync(path.join(distDir, 'index.html'))) {
  console.error('Error: index.html not found in build output');
  process.exit(1);
}

// Check for assets directory
const assetsDir = path.join(distDir, 'assets');
if (!fs.existsSync(assetsDir)) {
  console.error('Error: assets directory not found in build output');
  process.exit(1);
}

// List build files for debugging
console.log('Build output contains:');
const listDir = (dir, indent = '') => {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stats = fs.statSync(filePath);
    if (stats.isDirectory()) {
      console.log(`${indent}${file}/`);
      listDir(filePath, `${indent}  `);
    } else {
      console.log(`${indent}${file} (${stats.size} bytes)`);
    }
  });
};
listDir(distDir);

console.log('Build verification complete!'); 