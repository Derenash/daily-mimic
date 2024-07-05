const fs = require('fs-extra');
const glob = require('glob');

// Array of file patterns to copy
const filesToCopy = [
  'src/index.html',
  'src/css/*',
  'src/assets/*'
];

// Destination directory
const destDir = 'dist';

// Copy files based on the patterns
filesToCopy.forEach(pattern => {
  glob(pattern, (err, files) => {
    if (err) {
      console.error(`Error copying files: ${err}`);
      return;
    }

    files.forEach(file => {
      const destPath = file.replace('src', destDir);
      fs.copySync(file, destPath);
      console.log(`Copied ${file} to ${destPath}`);
    });
  });
});