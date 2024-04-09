import AWS from "aws-sdk";
import multer from "multer";
import multerS3 from "multer-s3";
import { v4 as uuidv4 } from "uuid";
import { AWS_BUCKET_NAME } from "../../config/aws-s3-config.js";

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

export const S3 = new AWS.S3();
const isAllowedVideotype = (mime) => {
  const allowedVideoExtensions = [
    "video/mp4",
    "video/mpeg",
    "video/quicktime",
    "video/x-msvideo",
    "video/x-flv",
    "video/x-ms-wmv",
    "video/webm",
    "video/x-matroska",
    "video/3gpp",
    "video/3gpp2",
    "video/x-ms-asf",
  ];
  const extension = mime.split(".").pop();
  return allowedVideoExtensions.includes(extension);
};

const isAllowedThumbnailType = (mime) => {
  const allowedThumbnailExtensions = [
    "image/png",
    "image/jpg",
    "image/jpeg",
    "image/x-ms-bmp",
    "image/webp",
  ];
  const extension = mime.split(".").pop();
  return allowedThumbnailExtensions.includes(extension);
};

const fileFilter = (req, file, callback) => {
  const fileMime = file.mimetype;
  if (isAllowedVideotype(fileMime) || isAllowedThumbnailType(fileMime)) {
    callback(null, true);
  } else {
    callback(null, false);
  }
};

const isVideo = (mime) => {
  if (isAllowedVideotype(mime)) return true;
  else if (isAllowedThumbnailType(mime)) return false;
  throw new Error("Neither a video nor a thumbnail");
};
const generateUploadMiddleware = (fileId) => {
  return multer({
    fileFilter,
    storage: multerS3({
      s3: S3,
      bucket: AWS_BUCKET_NAME,
      contentType: multerS3.AUTO_CONTENT_TYPE,
      key: function (req, file, cb) {
        const ext = file.originalname.split(".").pop();
        const type = isVideo(file.mimetype) ? "video" : "thumbnail";
        const path = `user_id_here_please_please/${fileId}`;
        const fileName = `${type}.${ext}`;
        const finalPath = `${path}/${fileName}`;
        file.filename = fileName;
        req.body.videoId = fileId;
        req.body.videoPath = `https://${AWS_BUCKET_NAME}.s3.amazonaws.com/${path}`;
        if (type == "video") req.body.videoExt = ext;
        else req.body.thumbnailExt = ext;
        cb(null, finalPath);
      },
    }),
  });
};
export const handleUploadMiddleware = (req, res, next) => {
  try {
    const fileId = uuidv4();
    req.body.videoId = fileId;
    const uploadMiddleware = generateUploadMiddleware(fileId);
    uploadMiddleware.array("files", 2)(req, res, next);
  } catch (error) {
    res.status(500).json({ message: error });
  }
};
