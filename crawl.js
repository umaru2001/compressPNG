const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

// 爬取指定URL的内容
async function crawlWebsite(url) {
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching website:', error);
    return null;
  }
}

// 解析HTML内容，提取目标元素并构造对象
function parseHTML(html) {
  const $ = cheerio.load(html);
  const results = [];

  $('div.list').each((index, element) => {
    const linkUrl = $(element).attr('link-url');
    const linkTitle = $(element).attr('link-title');
    const iconSrc = $(element).find('img').attr('src');
    const descText = $(element).find('p.desc').text().trim();

    const obj = {
      title: linkTitle,
      url: linkUrl,
      icon: iconSrc,
      description: descText,
    };

    results.push(obj);
  });

  return results;
}

// 将结果写入output.js文件
function writeOutputFile(data) {
  const outputData = `const output = ${JSON.stringify(data, null, 2)};\n\nmodule.exports = output;`;

  fs.writeFile('output.js', outputData, (error) => {
    if (error) {
      console.error('Error writing output file:', error);
    } else {
      console.log('Output file created: output.js');
    }
  });
}

// 主函数
async function main() {
  const url = 'https://ntr.best/';
  const html = await crawlWebsite(url);
  if (html) {
    const data = parseHTML(html);
    writeOutputFile(data);
  }
}

// 运行主函数
main();