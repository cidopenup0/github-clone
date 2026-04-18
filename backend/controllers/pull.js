const fs = require("fs").promises;
const path = require("path");
const { s3, S3_BUCKET } = require("../config/aws-config");

async function pullRepo() {
  const repoPath = path.resolve(process.cwd(), ".git-clone");
  const commitsPath = path.join(repoPath, "commits");

  try {
    const data = await s3
      .listObjectsV2({ Bucket: S3_BUCKET, Prefix: "commits/" })
      .promise();

    const objects = data.Contents;
    for (const obj of objects) {
      const key = obj.Key;
      if (!key) {
        continue;
      }

      const commitDir = path.join(
        commitsPath,
        path.dirname(key).split("/").pop(),
      );

      await fs.mkdir(commitDir, { recursive: true });

      const params = { Bucket: S3_BUCKET, Key: key };
      const fileObject = await s3.getObject(params).promise();
      await fs.writeFile(path.join(repoPath, key), fileObject.Body);
    }

    console.log("All commits pulled from S3.");
  } catch (error) {
    console.error("Error pulling repository:", error);
  }
}

module.exports = { pullRepo };
