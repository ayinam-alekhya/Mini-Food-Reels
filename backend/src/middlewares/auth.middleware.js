const foodPatnerModel = require('../models/foodPatner.model');
const userModel = require('../models/user.model');
const jwt = require("jsonwebtoken");

async function authFoodPatnerMiddleware(req, res, next) {
    const token = req.cookies.token;
    if(!token){
        return res.status(401).json({
            message: "Please login first"
        })
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const foodPatner = await foodPatnerModel.findById(decoded.id);
        req.foodPatner = foodPatner;
        next();

    } catch (err) {
        return res.status(401).json({
            message: "Invalid token"
        })
    }
}

async function authUserMiddleware(req, res, next) {
    const token = req.cookies.token;
    if(!token){
        return res.status(401).json({
            message: "Please login first"
        })
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userModel.findById(decoded.id);
        req.user = user;
        next();

    } catch (err) {
        return res.status(401).json({
            message: "Invalid token"
        })
    }
}

module.exports = {
    authFoodPatnerMiddleware,
    authUserMiddleware
}