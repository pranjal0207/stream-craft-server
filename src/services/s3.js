import dotenv from "dotenv";
dotenv.config();
import AWS from "aws-sdk";

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const s3 = new AWS.S3();

const bruh = () => {
  s3.listBuckets((err, data) => {
    if (err) {
      console.error("Error:", err);
    } else {
      console.log("Buckets:", data.Buckets);
    }
  });
};

export default bruh;
