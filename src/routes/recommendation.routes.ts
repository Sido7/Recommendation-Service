import express from 'express'
import { recommendationController } from '../controller/recommendation.controller'
const router = express.Router()

router.get('/recommendation',recommendationController.recommendationPersonalised)
router.get('/recommendation/general',recommendationController.recommendationGeneral)
router.post('/interaction',recommendationController.registerInteraction)

export default router