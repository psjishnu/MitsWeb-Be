const path = require("path");
const multer = require("multer");
const upload = multer().array("imgCollection");
const { v4: uuidv4 } = require("uuid");
const { Storage } = require("@google-cloud/storage");

let urls = [];
const storage = new Storage({
  projectId: process.env.PROJECT_ID,
  keyFilename: path.join(__dirname, "../../creds.json"),
});
const uploadFile = async (file, folder, returnURL) => {
  let bucketName = process.env.BUCKET_NAME;
  let bucket = storage.bucket(bucketName);
  const unique_id = uuidv4();
  let newFileName =
    "Profile Pictures" + "/" + `${unique_id + file.originalname}`;

  let fileUpload = bucket.file(newFileName);
  const blobStream = fileUpload.createWriteStream({
    metadata: {
      contentType: file.mimetype,
    },
  });

  blobStream.on("error", (error) => {
    console.log("Something is wrong! Unable to upload at the moment." + error);
    returnURL(false);
  });

  blobStream.on("finish", () => {
    const url = `https://storage.googleapis.com/${bucket.name}/${fileUpload.name}`;
    returnURL(url);
    urls.push(url);
  });

  blobStream.end(file.buffer);
};

const fileUploader = async (request, response, returnURL) => {
  try {
    upload(request, response, async (err) => {
      let files = request.files;
      let count = 0;

      for (let file in files) {
        uploadFile(files[file], request.body.folder, returnURL);
      }
      if (err) {
        console.log(err);
        returnURL(false);
        return false;
      }
    });
  } catch (err) {
    returnURL(false);
    response.send(err);
  }
};

module.exports = { fileUploader };
