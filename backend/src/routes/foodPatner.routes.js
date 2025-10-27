const express = require('express');
const authMiddleware = require('../middlewares/auth.middleware');
const foodPatnerController = require('../controller/foodPatner.controller');
const router = express.Router();

/* /api/foodPatner/:id */
router.get('/:id', authMiddleware.authUserMiddleware, foodPatnerController.getFoodPartnerById);

module.exports = router;