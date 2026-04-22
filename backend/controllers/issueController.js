const mongoose = require("mongoose");
const Repository = require("../models/repoModel");
const User = require("../models/userModel");
const Issue = require("../models/issueModel");

async function createIssue(req, res) {
  const { title, description } = req.body;
  const { id } = req.params; // Assuming the repository ID is passed as a URL parameter

  try {
    const newIssue = new Issue({
      title,
      description,
      repository: id,
    });

    const savedIssue = await newIssue.save();
    res.status(201).json(savedIssue);
  } catch (error) {
    console.error("Error creating issue:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

async function updateIssueById(req, res) {
  const { id } = req.params;
  const { title, description, status } = req.body;

  try {
    const issue = await Issue.findById(id);

    if (!issue) {
      return res.status(404).json({ message: "Issue not found" });
    }

    issue.title = title;
    issue.description = description;
    issue.status = status;

    const updatedIssue = await issue.save();
    res
      .status(200)
      .json({ message: "Issue updated successfully", issue: updatedIssue });
  } catch (error) {
    console.error("Error during issue updation:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

async function deleteIssueById(req, res) {
  const { id } = req.params;

  try {
    const issue = await Issue.findByIdAndDelete(id);

    if (!issue) {
      return res.status(404).json({ message: "Issue not found" });
    }
    res.status(200).json({ message: "Issue deleted successfully" });
  } catch (error) {
    console.error("Error during issue deletion:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

async function getAllIssues(req, res) {
  const repoID = req.params;

  try {
    const issues = await Issue.find({ repository: repoID });
    if (!issues || issues.length === 0) {
      return res.status(404).json({ message: "Issues not found" });
    }
    res.status(200).json({ issues, message: "Issues fetched successfully" });
  } catch (error) {
    console.error("Error fetching all issues:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

async function getIssueById(req, res) {
  const { id } = req.params;

  try {
    const issue = await Issue.findById(id);
    if (!issue) {
      return res.status(404).json({ message: "Issue not found" });
    }
    res.status(200).json({ issue, message: "Issue fetched successfully" });
  } catch (error) {
    console.error("Error fetching issue by ID:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = {
  createIssue,
  updateIssueById,
  deleteIssueById,
  getAllIssues,
  getIssueById,
};
