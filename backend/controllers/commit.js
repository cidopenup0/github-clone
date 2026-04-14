const fs = require("fs").promises;
const path = require("path");
const { v4: uuidv4 } = require("uuid");

async function commitRepo(message) {
  const repoPath = path.resolve(process.cwd(), ".git-clone");
  const statgedPath = path.join(repoPath, "staging");
  const commitsPath = path.join(repoPath, "commits");

  try {
    const commitID = uuidv4();
    const commitDir = path.join(commitsPath, commitID);
    await fs.mkdir(commitDir, { recursive: true });

    const files = await fs.readdir(statgedPath);
    for (const file of files) {
      const src = path.join(statgedPath, file);
      const dest = path.join(commitDir, file);
      await fs.copyFile(src, dest);
    }

    await fs.writeFile(
      path.join(commitDir, "commit.json"),
      JSON.stringify({ id: commitID, message, date: new Date().toISOString() }),
    );
    console.log(`Committed ${commitID} created with message: ${message}`);
  } catch (err) {
    console.error("Error committing changes: ", err);
  }
}

module.exports = { commitRepo };
