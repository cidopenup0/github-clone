const fs = require("fs").promises;
const path = require("path");
const { promisify } = require("util");

const readdir = promisify(fs.readdir);
const copyFile = promisify(fs.copyFile);

async function revertRepo(commitID) {
  const repoPath = path.resolve(process.cwd(), ".git-clone");
  const commitsPath = path.join(repoPath, "commits");

  try {
    const commitDir = path.join(commitsPath, commitID);
    const files = await fs.readdir(commitDir);
    const parentDir = path.resolve(repoPath, "..");

    for (const file of files) {
      const srcPath = path.join(commitDir, file);
      const destPath = path.join(parentDir, file);
      await fs.copyFile(srcPath, destPath);
    }

    console.log(`Repository reverted to commit ${commitID}.`);
  } catch (error) {
    console.error("Error reverting repository:", error);
  }
}

module.exports = { revertRepo };
