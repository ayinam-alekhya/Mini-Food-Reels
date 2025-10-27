const express=require('express');
const cp = require('cookie-parser');
const authRoutes= require('./routes/auth.routes');
const foodRoutes=require('./routes/food.routes')
const foodPatnerRoutes=require('./routes/foodPatner.routes');


const cors = require('cors');

const app = express();
app.use(cp());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}));
app.get('/',(req,res)=>{
    res.send("Hello everyone!!");
})

app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/food', foodRoutes);
app.use('/api/foodPatner', foodPatnerRoutes);

module.exports =app;   
