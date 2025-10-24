import express from 'express'
import { EntityMetadata } from 'typeorm';
import dotenv from 'dotenv'
import connectMongo from './configs/mongo_db.config'
import { connectSqldb } from './configs/sql_db.config'
import ExternalArticle from './entity/content.entity'
import articleRoutes from './routes/index'
import 'reflect-metadata';

dotenv.config()
const app = express()

const port = process.env.port || 3002

app.get('/health', async (req, res) => {
    res.send("Recommendation Service is working fine")
})

app.use('/v1',articleRoutes)

app.listen(port,async ()=>{
    await connectSqldb()
    await connectMongo()
    console.log("server has started running on ",port)
})