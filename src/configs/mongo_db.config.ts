import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectMongo = async () =>{

    const mongoUrl = process.env.mongodb_url || ''
    

    try{
        if(!mongoUrl){
            throw Error("Mongo DB URL missing")
        }
        const connection = await mongoose.connect(mongoUrl)
        console.log("mongoDB connection successfull")

    }catch(error){
          throw Error("Mongo DB connection fail")
    }
}

export default connectMongo