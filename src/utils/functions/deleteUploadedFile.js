const fs = require("fs");
const deleteUploadedFiles = (files) => {
    if (!files) return;
    Object.values(files).flat().forEach(file => {
      if (file && file.path) { // Check if file and file.path are defined
        fs.unlink(file.path, (err) => {
          if (err) {
            console.error(`Error deleting file ${file.path}:`, err);
          } else {
            console.log(`Deleted file: ${file.path}`);
          }
        });
      }
    });
  };

  module.exports = deleteUploadedFiles;