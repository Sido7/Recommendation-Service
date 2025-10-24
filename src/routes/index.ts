import express from 'express'
import recommendationRoutes from './recommendation.routes'
const router = express.Router()

router.use('/articles',recommendationRoutes)


export default router