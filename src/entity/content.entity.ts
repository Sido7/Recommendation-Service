import {model, Schema} from 'mongoose'

const ExternalArticleSchema = new Schema({
    _id: Schema.Types.ObjectId,
   article_id: {type: Schema.Types.ObjectId, required: true, ref: "Article"},
    article: {type: String, required: true},
    imageUrl: {type: String},
    sentiment: {type: String, required: true},
    keywords: {type: [String], required: true}
},
{
     collection: 'processedarticles', 
  strict: false,
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
}
)

const ExternalArticle = model('ExternalArticle', ExternalArticleSchema);

export default ExternalArticle