const fs = require('fs');
const path = require('path');
const tinify = require("tinify");
tinify.key = "9CQmVmBl3G7RKX6FCqyp6lBzN2xtQ15Y";

const folderPath = path.join(__dirname, '..', 'r18'); // 替换为您的文件夹路径
const folderName = 'r18'; // 新文件夹的名称
const imageCount = 500; // 替换为要压缩的图片数量

async function compressImage(imagePath, outputPath) {
  try {
    const source = tinify.fromFile(imagePath);
    await source.toFile(outputPath);
    console.log(`压缩成功：${outputPath}`);
  } catch (error) {
    console.error(`压缩失败：${imagePath}`, error);
  }
};

async function compressImagesInFolder(folderPath, count) {
  try {
    const imageFiles = fs.readdirSync(folderPath).filter(file => {
      const extension = path.extname(file).toLowerCase();
      return extension === '.png' || extension === '.jpg' || extension === '.jpeg';
    });

    const selectedImages = imageFiles.slice(0, count);
    for (const imageFile of selectedImages) {
      const imagePath = path.join(folderPath, imageFile);
      const compressedImagePath = path.join(__dirname, folderName, imageFile); // 修改输出路径
      await compressImage(imagePath, compressedImagePath); // 传递输出路径给compressImage函数
    }
  } catch (error) {
    console.error('压缩图片时发生错误：', error);
  }
};

function createOutputFolder() {
  const folderPath = path.join(__dirname, folderName);

  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath);
  }

  return folderPath;
};

createOutputFolder();
compressImagesInFolder(folderPath, imageCount);