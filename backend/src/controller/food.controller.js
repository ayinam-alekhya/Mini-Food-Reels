const foodModel = require('../models/food.model');
const storageService = require('../services/storage.service');
const likeModel = require('../models/likes.model');
const saveModel = require('../models/save.model');

const {v4:uuid}= require("uuid");

async function createFood(req, res) {
    //console.log(req.foodPatner);
    const fileUploadResult = await storageService.uploadFile(req.file.buffer , uuid());
    const food = await foodModel.create({
        name:req.body.name,
        description:req.body.description,
        video:fileUploadResult.url,
        foodPatner:req.foodPatner._id

    })
    //console.log(fileUploadResult);
    res.status(201).json({
        message: "Food created successfully",
        food:food
    })
}

async function getFoodItems(req, res) {
    const foodItem = await foodModel.find({})
    res.status(200).json({
        message: "Food item fetched successfully",
        foodItem
    })
}

async function likeFood(req, res) {
  try {
    const { foodId } = req.body;
    const userId = req.user._id;  

    if (!foodId) {
      return res.status(400).json({ message: "foodId is required" });
    }

    const isAlreadyLiked = await likeModel.findOne({ userId, foodId });

    if (isAlreadyLiked) {
      await likeModel.deleteOne({ userId, foodId });
      await foodModel.findByIdAndUpdate(foodId, { $inc: { likeCount: -1 } });

      return res.status(200).json({
        message: "Food unliked successfully",
        liked: false
      });
    }

    const like = await likeModel.create({ userId, foodId });
    await foodModel.findByIdAndUpdate(foodId, { $inc: { likeCount: 1 } });

    return res.status(201).json({
      message: "Food liked successfully",
      liked: true,
      like
    });

  } catch (err) {
    console.error("likeFood error:", err);
    res.status(500).json({ message: "Server Error" });
  }
}

// Save / Unsave a food
async function saveFood(req, res) {
  try {
    const { foodId } = req.body;
    const userId = req.user?._id;           // from authUserMiddleware
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });
    if (!foodId) return res.status(400).json({ message: 'foodId is required' });

    const existing = await saveModel.findOne({ userId, foodId });
    if (existing) {
      await existing.deleteOne();
      await foodModel.findByIdAndUpdate(foodId, { $inc: { saveCount: -1 } });
      return res.status(200).json({ message: 'Food unsaved successfully' });
    }

    const saved = await saveModel.create({ userId, foodId });
    await foodModel.findByIdAndUpdate(foodId, { $inc: { saveCount: 1 } });
    return res.status(201).json({ message: 'Food saved successfully', save: saved });
  } catch (err) {
    console.error('saveFood error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
}

// Get all saved foods (as Food docs)
// GET /api/food/saved
async function getSavedFoods(req, res) {
  try {
    // authUserMiddleware sets req.user to the logged-in user doc
    if (!req.user?._id) {
      return res.status(401).json({ message: 'Please login first' });
    }

    const userId = req.user._id;

    // Find saved items for this user, newest first
    const saves = await saveModel
      .find({ userId })
      .sort({ createdAt: -1 })
      .populate({
        path: 'foodId',
        // Make sure these fields exist in your Food schema
        select: 'video description foodPatner likeCount saveCount',
        // If your ref name in save.model.js != 'Food', ensure it matches the actual model name
        // model: 'Food' // uncomment and set if needed
      });

    // Normalize to just the populated food docs (filter out any nulls)
    const saved = saves
      .map(s => s.foodId)
      .filter(Boolean)
      .map(f => ({
        _id: f._id,
        video: f.video,
        description: f.description || '',
        foodPatner: f.foodPatner,
        likeCount: typeof f.likeCount === 'number' ? f.likeCount : 0,
        saveCount: typeof f.saveCount === 'number' ? f.saveCount : 0,
      }));

    return res.status(200).json({
      message: 'Saved foods fetched successfully',
      saved,
    });
  } catch (err) {
    console.error('getSavedFoods error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
}
module.exports = {
    createFood,
    getFoodItems,
    likeFood,
    saveFood,
    getSavedFoods
}