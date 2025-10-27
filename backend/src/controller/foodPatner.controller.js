const foodPatnerModel = require('../models/foodPatner.model');
const foodModel = require('../models/food.model');

async function getFoodPartnerById(req, res) {
    const partnerId = req.params.id;

    try {
        const foodPartner = await foodPatnerModel.findById(partnerId);
        const foodItemBelongingToPartner = await foodModel.find({ foodPatner: partnerId });
        if (!foodPartner) {
            return res.status(404).json({ message: 'Food Partner not found' });
        }
        res.status(200).json({
            message: 'Food Partner fetched successfully',
            foodPartner:{
                ...foodPartner.toObject(),
                foodItems: foodItemBelongingToPartner
            }
        });
    } catch (error) {
        console.error('Error fetching food partner by ID:', error);
        res.status(500).json({ message: 'Server error' });
    }
}

module.exports = {
    getFoodPartnerById,
};