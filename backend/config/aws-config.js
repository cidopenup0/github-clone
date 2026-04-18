require("dotenv").config();

const {
  S3Client,
  PutObjectCommand,
  ListObjectsV2Command,
  GetObjectCommand,
} = require("@aws-sdk/client-s3");

const clientConfig = {
  region: process.env.AWS_REGION || "ap-south-1",
};

clientConfig.credentials = {
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
};

const s3Client = new S3Client(clientConfig);

async function collectBody(body) {
  if (!body) {
    return Buffer.alloc(0);
  }

  if (Buffer.isBuffer(body) || body instanceof Uint8Array) {
    return Buffer.from(body);
  }

  if (typeof body.transformToByteArray === "function") {
    return Buffer.from(await body.transformToByteArray());
  }

  const chunks = [];
  for await (const chunk of body) {
    chunks.push(Buffer.from(chunk));
  }

  return Buffer.concat(chunks);
}

const s3 = {
  upload(params) {
    return {
      promise: async () => {
        return s3Client.send(new PutObjectCommand(params));
      },
    };
  },
  listObjectsV2(params) {
    return {
      promise: async () => {
        return s3Client.send(new ListObjectsV2Command(params));
      },
    };
  },
  getObject(params) {
    return {
      promise: async () => {
        const response = await s3Client.send(new GetObjectCommand(params));
        return {
          ...response,
          Body: await collectBody(response.Body),
        };
      },
    };
  },
};

const S3_BUCKET = "github-clone-s3";

module.exports = { s3, S3_BUCKET };
