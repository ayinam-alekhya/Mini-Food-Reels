const ImageKit = require("imagekit");

const imagekit = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
});
async function uploadFile(buffer, fileName, mimeType) {
  const result = await imagekit.upload({
    file: buffer,              // buffer
    fileName,                  // must include extension
    useUniqueFileName: false,  // we pass our own UUID filename
    folder: "foods",           // optional but recommended
    tags: ["food-video"],      // optional for management
    mime: mimeType             // helps ImageKit set correct type
  });

  return result;
}

module.exports = {
    uploadFile
}
