const express = require("express");
const router = express.Router();
const path = require("path");
const multer = require("multer");
const upload = multer().array("imgCollection");
const { v4: uuidv4 } = require("uuid");

let urls = [];

router.post("/", function (req, res, next) {
  const { Storage } = require("@google-cloud/storage");

  const storage = new Storage({
    projectId: process.env.PROJECT_ID,
    keyFilename: path.join(__dirname, "../../creds.json"),
  });

  try {
    async function uploadFile(file, folder) {
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
        console.log(
          "Something is wrong! Unable to upload at the moment." + error
        );
      });

      blobStream.on("finish", () => {
        const url = `https://storage.googleapis.com/${bucket.name}/${fileUpload.name}`;
        console.log(url);
        urls.push(url);
      });

      blobStream.end(file.buffer);
    }

    upload(req, res, function (err) {
      let files = req.files;
      for (let file in files) {
        uploadFile(files[file], req.body.folder);
      }

      if (err) {
        return res.end("Error uploading file." + err);
      }
      res.end("File is uploaded");
    });
  } catch (err) {
    res.send(err);
  }
});

module.exports = router;
