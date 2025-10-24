import { recommendationInstance } from "../services/recommendation.service";

class RecommendationController{
    public async recommendationPersonalised(req: any,res:any){
        const {userId} = req.user;
        const {limit = 50} = req.param
        try{
            const recommendation = await recommendationInstance.getRecommendation(userId,limit)
            res.status(200).json({
                data: recommendation
            })
        }catch(error){
            console.log(error)
            res.status(500).send(error)
        }
        
    }

    public async recommendationGeneral(req: any,res:any){
       const limit = parseInt(req.query.limit as string) || 20;

        try {
            // Service method handles the non-personalized, latest-articles logic
            const publicFeed = await recommendationInstance.getPublicFeed(limit); 
            res.status(200).json({ data: publicFeed });
        } catch (error) {
            console.error('[Public Feed Error]', error);
            res.status(500).json({ error: 'Failed to retrieve public feed.' });
        }
        
    }

    public async registerInteraction(req: any,res:any){
        const {userId} = req.user;
        const {articleId,action} = req.body;
        try{
            await recommendationInstance.registerInteraction(userId,articleId,action)
            res.status(200).send("Interaction registered successfully")
        }catch(error){
             console.log(error)
            res.status(500).send(error)
        }
    }
}

export const recommendationController = new RecommendationController