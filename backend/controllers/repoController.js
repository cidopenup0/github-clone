const mongoose = require("mongoose");
const Repository = require("../models/repoModel");
const User = require("../models/userModel");
const Issue = require("../models/issueModel");

async function createRepository(req, res) {
  const { owner, name, issues, content, description, visibility } = req.body;
  try {
    if (!name) {
      return res.status(400).json({ message: "Repository name is required" });
    }

    if (!mongoose.Types.ObjectId.isValid(owner)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const newRepository = new Repository({
      owner,
      name,
      issues,
      content,
      description,
      visibility,
    });
    const result = await newRepository.save();
    res.status(201).json({
      message: "Repository created successfully",
      repositoryID: result._id,
    });
  } catch (error) {
    console.error("Error creating repository:", error);
    res.status(500).json({ message: "Error creating repository" });
  }
}

async function getAllRepositories(req, res) {
  try {
    const repositories = await Repository.find()
      .populate("owner")
      .populate("issues");

    res.status(200).json(repositories);
  } catch (error) {
    console.error("Error fetching repositories:", error);
    res.status(500).send({ message: "Internal server error" });
  }
}

async function fetchRepositoryById(req, res) {
  const repoID = req.params.id;

  try {
    const repository = await Repository.findById({ _id: repoID })
      .populate("owner")
      .populate("issues");

    res.json(repository);
  } catch (error) {
    console.error("Error fetching repository:", error);
    res.status(500).send({ message: "Internal server error" });
  }
}

async function fetchRepositoryByName(req, res) {
  const repoName = req.params.name;

  try {
    const repository = await Repository.findOne({ name: repoName })
      .populate("owner")
      .populate("issues");

    res.json(repository);
  } catch (error) {
    console.error("Error fetching repository:", error);
    res.status(500).send({ message: "Error fetching repository" });
  }
}

async function fetchRepositoryForCurrentUser(req, res) {
  const userID = req.user;

  try {
    const repositories = await Repository.find({ owner: userID })
      .populate("owner")
      .populate("issues");

    if (!repositories || repositories.length === 0) {
      return res
        .status(404)
        .json({ message: "No repositories found for the user" });
    }
    res.json({ message: "Repositories found", repositories });
  } catch (error) {
    console.error("Error fetching user repository:", error);
    res.status(500).send({ message: "Internal server error" });
  }
}

async function updateRepositoryById(req, res) {
  const repoID = req.params;
  const { description, content } = req.body;

  try {
    const repository = await Repository.findById(repoID);

    if (!repository) {
      return res.status(404).json({ message: "Repository not found" });
    }

    repository.content.push(content);
    repository.description = description;

    const updatedRepository = await repository.save();

    res.json({
      message: "Repository updated successfully",
      repository: updatedRepository,
    });
  } catch (error) {
    console.error("Error updating repository:", error);
    res.status(500).send({ message: "Internal server error" });
  }
}

async function toggleVisibilityById(req, res) {
  const repoID = req.params;

  try {
    const repository = await Repository.findById(repoID);

    if (!repository) {
      return res.status(404).json({ message: "Repository not found" });
    }

    repository.visibility = !repository.visibility;

    const updatedRepository = await repository.save();

    res.json({
      message: "Repository visibility updated successfully",
      repository: updatedRepository,
    });
  } catch (error) {
    console.error("Error toggling repository visibility:", error);
    res.status(500).send({ message: "Internal server error" });
  }
}

async function deleteRepositoryById(req, res) {
  const repoID = req.params;

  try {
    const repository = await Repository.findByIdAndDelete(repoID);
    if (!repository) {
      return res.status(404).json({ message: "Repository not found" });
    }
    res.json({ message: "Repository deleted successfully" });
  } catch (error) {
    console.error("Error deleting repository:", error);
    res.status(500).send({ message: "Internal server error" });
  }
}

module.exports = {
  createRepository,
  getAllRepositories,
  fetchRepositoryById,
  fetchRepositoryByName,
  fetchRepositoryForCurrentUser,
  updateRepositoryById,
  deleteRepositoryById,
  toggleVisibilityById,
};
