const ArtPrint = require("../models/artPrintModel");

/**
 * Create new ArtPrint
 */
exports.createArtPrint = async (req, res) => {
  try {
    const { title, artist, price, description } = req.body;
    const newArtPrint = new ArtPrint({ title, artist, price, description });
    const saved = await newArtPrint.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error("Error in createArtPrint:", err);
    res.status(500).json({ error: "Failed to create ArtPrint" });
  }
};

/**
 * Get all ArtPrints
 */
exports.getAllArtPrints = async (req, res) => {
  try {
    const prints = await ArtPrint.find();
    res.json(prints);
  } catch (err) {
    console.error("Error in getAllArtPrints:", err);
    res.status(500).json({ error: "Failed to get ArtPrints" });
  }
};

/**
 * Get one ArtPrint
 */
exports.getOneArtPrint = async (req, res) => {
  try {
    const { id } = req.params;
    const print = await ArtPrint.findById(id);
    if (!print) {
      return res.status(404).json({ error: "ArtPrint not found" });
    }
    res.json(print);
  } catch (err) {
    console.error("Error in getOneArtPrint:", err);
    res.status(500).json({ error: "Failed to get ArtPrint" });
  }
};

/**
 * Update ArtPrint
 */
exports.updateArtPrint = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await ArtPrint.findByIdAndUpdate(id, req.body, { new: true });
    if (!updated) {
      return res.status(404).json({ error: "ArtPrint not found" });
    }
    res.json(updated);
  } catch (err) {
    console.error("Error in updateArtPrint:", err);
    res.status(500).json({ error: "Failed to update ArtPrint" });
  }
};

/**
 * Delete ArtPrint
 */
exports.deleteArtPrint = async (req, res) => {
  try {
    const { id } = req.params;
    const removed = await ArtPrint.findByIdAndDelete(id);
    if (!removed) {
      return res.status(404).json({ error: "ArtPrint not found" });
    }
    res.json({ message: "ArtPrint deleted", id });
  } catch (err) {
    console.error("Error in deleteArtPrint:", err);
    res.status(500).json({ error: "Failed to delete ArtPrint" });
  }
};
