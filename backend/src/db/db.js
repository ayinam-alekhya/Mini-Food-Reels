const mongoose=require('mongoose');

function conectDb(){
    mongoose.connect(process.env.MONGODB_URL)
        .then(() => {
            console.log("connected to monogoDb");
        })
        .catch((err) =>{
            console.log("MongoDb connection err: ",err);
        })
}
module.exports=conectDb;