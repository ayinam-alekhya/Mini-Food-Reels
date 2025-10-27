const express = require('express');
const foodController = require('../controller/food.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const multer = require('multer');

const upload = multer({
    storage: multer.memoryStorage()
})

const router = express.Router();

router.post('/',authMiddleware.authFoodPatnerMiddleware,upload.single("video"), foodController.createFood);
router.get('/',authMiddleware.authUserMiddleware,foodController.getFoodItems);

// like/unlike food item
router.post('/like', authMiddleware.authUserMiddleware, foodController.likeFood);

// toggle save/unsave
router.post('/save', authMiddleware.authUserMiddleware, foodController.saveFood);

// list saved foods for current user
router.get('/saved', authMiddleware.authUserMiddleware, foodController.getSavedFoods);

module.exports = router;