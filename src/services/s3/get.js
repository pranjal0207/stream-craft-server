import AWS from "aws-sdk";
import { AWS_BUCKET_NAME } from "../../../config/aws-s3-config.js";

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const S3 = new AWS.S3();

export const getSignedUrl = async (key) => {
  const params = {
    Bucket: AWS_BUCKET_NAME,
    Key: key,
    Expires: 3600,
  };

  try {
    const url = await new Promise((resolve, reject) => {
      S3.getSignedUrl("getObject", params, (error, url) => {
        if (error) {
          reject(error);
        } else {
          resolve(url);
        }
      });
    });
    return url;
  } catch (error) {
    throw error;
  }
};
