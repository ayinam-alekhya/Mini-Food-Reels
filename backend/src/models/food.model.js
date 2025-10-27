const mongoose = require("mongoose");

const foodSchema =new mongoose.Schema({
    name:{
        type: String,
        required:true
    },
    video:{
        type:String,
        required:true
    },
    description:{
        type:String
    },
    foodPatner:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"foodPatner"
    },
    likeCount:{
        type:Number,
        default:0
    },
    saveCount:{
        type:Number,
        default:0
    },
})

const foodModel = mongoose.model("food", foodSchema);

module.exports = foodModel;