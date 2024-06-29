// const mongoose = require("mongoose");
// require("dotenv").config();

// exports.connect = () => {
//     mongoose.connect(process.env.MONGODB_URL)
//     .then(() => console.log("DB Connected Successfully"))
//     .catch( (error:any) => {
//         console.log("DB Connection Failed");
//         console.error(error);
//         process.exit(1);
//     } )
// };

import mongoose from "mongoose";

export const dbConnect = async ()=>{
    try{
        if (!process.env.MONGO_URL) {
          throw new Error('mongo url not defined')
        }
        const conn = await mongoose.connect(process.env.MONGO_URL);
        console.log(`MongoDb connected`);
    }
    catch(error){
        console.log(error)
        process.exit(1);
    }
}