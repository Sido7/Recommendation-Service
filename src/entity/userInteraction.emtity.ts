import { Entity, PrimaryGeneratedColumn, Column, Index, BaseEntity } from 'typeorm';

@Entity({ name: 'user_interactions' })
@Index(['userId', 'articleId'], { unique: true }) // Prevents duplicate entries for the same user/article
export class UserInteraction extends BaseEntity{
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  // Application-level Foreign Key to the Auth Service's User table (crucial for decoupling)
  @Column({ type: 'varchar', nullable: false, name: 'user_id' })
  userId!: string; 

  // Foreign Key to the AI Service's/Aggregator Service's Article (MongoDB ObjectId represented as a string)
  @Column({ type: 'varchar', nullable: false, name: 'article_id' }) 
  articleId!: string;

  // Explicitly track the action
  @Column({ type: 'enum', enum: ['read', 'like', 'share'], default: 'read' })
  actionType!: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', name: 'interacted_at' })
  interactedAt!: Date;
}