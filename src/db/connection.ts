import config from "../config";
// import { createConnection, MongoError } from "typeorm";
import { connect as mongoConnect } from "mongoose";


export const connect = async()=>{

    console.log(config.DB_URL);
    return new Promise<void>((resolve, reject) =>mongoConnect(config.DB_URL,{
        autoIndex:true
    }, (err)=>{
        console.log(err);
        if(err){
            console.log(err);
            reject(err);
        }
        console.log("CONNECTED TO DB");
        resolve();
    }));
}