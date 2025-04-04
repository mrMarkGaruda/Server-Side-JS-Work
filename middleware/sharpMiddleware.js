const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

const sharpMiddleware = (outputFormat = "webp", quality = 80) => {
  return async (req, res, next) => {
    if (!req.file) return next();
    try {
      const inputPath = req.file.path;
      const filenameWithoutExt = path.parse(req.file.filename).name;
      const outputPath = path.join("uploads", `${filenameWithoutExt}.${outputFormat}`);
      
      await sharp(inputPath)
        .toFormat(outputFormat, { quality })
        .toFile(outputPath);
      
      // Delete the original file
      fs.unlink(inputPath, (err) => {
        if (err) console.error("Error deleting original file:", err);
      });
      
      // Update file object with processed file info
      req.file.processedPath = outputPath;
      req.file.mimetype = `image/${outputFormat}`;
      req.file.originalname = `${filenameWithoutExt}.${outputFormat}`;
      next();
    } catch (error) {
      console.error("Error processing image with Sharp:", error);
      res.status(500).json({ error: "Failed to process image" });
    }
  };
};

module.exports = sharpMiddleware;
