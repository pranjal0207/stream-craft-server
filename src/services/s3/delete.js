import AWS from "aws-sdk";
import { AWS_BUCKET_NAME } from "../../../config/aws-s3-config.js";

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

export const S3 = new AWS.S3();

export const deleteFolderFromS3 = (folderPath) => {
  const params = {
    Bucket: AWS_BUCKET_NAME,
    Prefix: folderPath,
  };

  return new Promise((resolve, reject) => {
    S3.listObjectsV2(params, async (error, data) => {
      if (error) {
        reject(`Error listing objects in folder ${folderPath}: ${error}`);
        return;
      }

      try {
        if (data.Contents.length > 0) {
          const deletePromises = data.Contents.map((object) => {
            return S3.deleteObject({
              Bucket: AWS_BUCKET_NAME,
              Key: object.Key,
            }).promise();
          });
          await Promise.all(deletePromises);
        }

        await S3.deleteObject({
          Bucket: AWS_BUCKET_NAME,
          Key: folderPath,
        }).promise();

        resolve(
          `Successfully deleted folder ${folderPath} and its contents from S3.`
        );
      } catch (error) {
        reject(
          `Error deleting folder ${folderPath} and its contents from S3: ${error}`
        );
      }
    });
  });
};
