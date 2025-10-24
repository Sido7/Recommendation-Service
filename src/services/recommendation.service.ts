import AppDataSource from "../configs/sql_db.config";
import ExternalArticle from "../entity/content.entity";
import { UserInteraction } from "../entity/userInteraction.emtity";
import { Schema, Types } from "mongoose";

const userInteractionRepositry = AppDataSource.getRepository(UserInteraction)
class RecommendationSerice{
       

        public async getRecommendation(userId: string,limit: number = 50){
            try{
                 const userHistory = await userInteractionRepositry.find({
                    where: {userId},
                    select: ['articleId', 'actionType', 'interactedAt'] as any, // TypeORM selects
                    order: { interactedAt: 'DESC' },
                    take: 50 // Look at the last 50 interactions
                 })

                 if(userHistory.length===0){
                   try {
            
            const queryCriteria = {
                status: 'processed'
            };

        
            const analyses = await ExternalArticle.find(queryCriteria)
                .sort({ 'created_at': -1 }) 
                .limit(limit)
                .select('article_id summary keywords imageUrl') 

            // 3. Transform and Return
            return analyses.map(analysis => ({
                articleId: analysis.article_id.toString(),
                summary: analysis.summary,
                keywords: analysis.keywords,
                imageUrl: analysis.image_url_suggestion,
            }));

        } catch (error) {
            console.error('[Recommendation Service Error] Failed to fetch public feed from MongoDB:', error);
            throw new Error("Infrastructure failure while retrieving public content."); 
        }
                 }

                 const articeId = userHistory.map((i)=> new Types.ObjectId(i.articleId))

                 const topArticleId = userHistory.slice(0,10).map((i)=>new Types.ObjectId(i.articleId))

                 const articleAnalysis = await  ExternalArticle.find({
                    article_id: {$in: topArticleId}
                 })

                 const allKeyWords = articleAnalysis.flatMap((i)=>i.keywords)
                 const topKeywords = [...new Set(allKeyWords)].slice(0,5)

                 let recommendationquery: any = {}

                 if(topKeywords.length>0){
                    recommendationquery = {
                        article_id: {$nin:articeId},
                        keywords:{$in:topKeywords}
                    }
                 }else{
                    recommendationquery = {
                        article_id: {$nin:articeId},
                    }
                 }

                 const recommendedArticles = await ExternalArticle.find(recommendationquery)
                                             .sort({ 'created_at': -1 }) // Sort by newest first
                                             .limit(limit)
                                             .exec();

                 return recommendedArticles.map(analysis => ({
        articleId: analysis.article_id.toString(),
        summary: analysis.summary,
        keywords: analysis.keywords,
        // (The frontend uses articleId to fetch full article via Aggregation Service API)
    }));
            }catch(error){
                console.log("something went wrong")
            }
        }

        public async getPublicFeed(limit: number = 20): Promise<any[]> {
        console.log(`[REC Service] Generating public feed. Limit: ${limit}`);
        
        try {
            // 1. Define the query criteria
            const queryCriteria = {
                status: 'processed'
            };

        
            const analyses = await ExternalArticle.find(queryCriteria)
                .sort({ 'created_at': -1 }) 
                .limit(limit)
                .select('article_id summary keywords imageUrl') 

            // 3. Transform and Return
            return analyses.map(analysis => ({
                articleId: analysis.article_id.toString(),
                summary: analysis.summary,
                keywords: analysis.keywords,
                imageUrl: analysis.image_url_suggestion,
            }));

        } catch (error) {
            // LLD Principle: Log the infrastructure error in the service layer 
            console.error('[Recommendation Service Error] Failed to fetch public feed from MongoDB:', error);
            
            // Re-throw a generic error to be caught by the Controller's outer catch block (Error translation layer)
            throw new Error("Infrastructure failure while retrieving public content."); 
        }
    

    // ... (rest of the RecommendationService class) ...
}

        public async registerInteraction(userId: string, articleId: string, action: string = 'read'): Promise<void> {
    // Upsert or create a new interaction record
    await userInteractionRepositry.upsert(
      { userId, articleId, actionType: action, interactedAt: new Date() },
      ['userId', 'articleId'] // Unique columns for upsert check
    );
  }
}

export const recommendationInstance = new RecommendationSerice()