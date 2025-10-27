const userModel = require('../models/user.model');
const foodPatnerModel = require('../models/foodPatner.model')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


async function registerUser(req, res) {
    
    const{fullName, email, password} = req.body;
    const isUserAlreadyExists = await userModel.findOne({
        email
    })
    
    if(isUserAlreadyExists){
        return res.status(400).json({
            message:"User Already Exists"
        })
    }

const hashedPassord =await bcrypt.hash(password, 10);
const user = await userModel.create({
    fullName,
    email,
    password: hashedPassord
})

const token = jwt.sign({
    id: user._id
}, process.env.JWT_SECRET)

res.cookie("token", token);
res.status(201). json({
    message: "User registered successfully",
    user:{
        _id:user._id,
        email: user.email,
        fullName: user.fullName
    }
})
}

async function loginUser(req, res) {
    const {email, password} = req.body;
    const user = await userModel.findOne({
        email
    })
    if(!user){
       return res.status(400).json({
            message: "Invalid email or password"
        })
    }
    const isPassword = await bcrypt.compare(password, user.password);
    if(!isPassword){
        return res.status(400).json({
            message: "Invalid email or password"
        })
    }

    const token = jwt.sign({
        id: user._id
    }, process.env.JWT_SECRET)

    res.cookie("token", token);
    res.status(200).json({
        message:"User logged in successfully",
        user:{
            id:user._id,
            email:user.email,
            fullName:user.fullName
        }
    })
}

function logoutUser(req, res) {
    res.clearCookie("token");
    res.status(200).json({
        message:"Logged out successfully"
    })
}
async function registerFoodPatner(req, res) {

    const {name, email, password, contactName, phoneNumber, address} = req.body;
    

    const isAccountExist = await foodPatnerModel.findOne({
        email
    })

    if(isAccountExist){
        return res.status(400).json({
            message: "Account already exists"
        })
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const foodPatner = await foodPatnerModel.create({
        name,
        email,
        password: hashedPassword,
        contactName,
        phoneNumber,
        address 
    })

    const token = jwt.sign({
        id: foodPatner._id
        }, process.env.JWT_SECRET)
    
    res.cookie("token", token);
    res.status(201).json({
        message: "Account created",
        foodPatner:{
            id: foodPatner._id,
            email:foodPatner.email,
            name: foodPatner.name,
            address: foodPatner.address,
            contactName: foodPatner.contactName,
            phoneNumber: foodPatner.phoneNumber
        }
    })

}

async function loginFoodPatner(req, res) {
    const {email, password} = req.body;
    const foodPatner = await foodPatnerModel.findOne({
        email
    })

    if(!foodPatner){
        return res.status(400).json({
            message: "Invalid email or password"
        })
    }

    const isPassword = await bcrypt.compare(password, foodPatner.password);

    if(!isPassword){
        return res.status(400).json({
            message: " Invalid email or password"
        })
    }

    const token = jwt.sign({
        id: foodPatner._id
    }, process.env.JWT_SECRET)

    res.cookie("token", token);
    res.status(200).json({
        message:"Food patner logged in successfully",
        user:{
            id:foodPatner._id,
            email:foodPatner.email,
            name:foodPatner.name
        }
    })
}

function logoutFoodPatner(req, res){
    res.clearCookie("token");
    res.status(200).json({
        message: "Account logged out successfully"
    })
}

 module.exports={
    registerUser,
    loginUser,
    logoutUser,
    registerFoodPatner,
    loginFoodPatner,
    logoutFoodPatner
 }