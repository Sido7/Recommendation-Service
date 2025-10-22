import express from 'express'
import dotenv from 'dotenv'
import connectMongo from './configs/mongo_db.config'
import { connectSqldb } from './configs/sql_db.config'
import ExternalArticle from './entity/content.entity'

const app = express()

const port = process.env.port || 3002

app.get('/health', async (req, res) => {
    res.send("Recommendation Service is working fine")
})


app.listen(port,async ()=>{
    await connectSqldb()
    await connectMongo()
    console.log("server has started running on ",port)
})