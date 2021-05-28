const { v4: uuidv4 } = require("uuid");
const { Storage } = require("@google-cloud/storage");
const path = require("path");

// Instantiate a storage client
const googleCloudStorage = new Storage({
  projectId: process.env.PROJECT_ID,
  keyFilename: path.join(__dirname, "../../creds.json"),
});

const bucket = googleCloudStorage.bucket(process.env.BUCKET_NAME);

const UploadToGCP = (file, folder) =>
  new Promise((resolve, reject) => {
    const { originalname, buffer } = file;
    const unique_id = uuidv4();

    let newFileName =
      folder + "/" + `${unique_id + originalname.replace(/ /g, "_")}`;

    const blob = bucket.file(newFileName);

    const blobStream = blob.createWriteStream({
      resumable: false,
      metadata: {
        contentType: file.mimetype,
      },
    });

    blobStream
      .on("finish", () => {
        const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
        resolve(publicUrl);
      })
      .on("error", () => {
        reject(`Unable to upload image, something went wrong`);
      })
      .end(buffer);
  });

module.exports = { UploadToGCP };
