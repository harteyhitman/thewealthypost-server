import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('blog_posts')
export class BlogPost {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  excerpt: string | null;
  
@Column({ default: 'draft' })
  status: 'draft' | 'published' | 'archived';

  @Column({ type: 'varchar', length: 500, nullable: true })
  featuredImage: string | null;

  @Column({ type: 'boolean', default: false })
  published: boolean;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

   @Column()
  author: string;

  @Column({ type: 'json', nullable: true })
  tags: string[];

  @Column({ default: 0 })
  viewCount: number;
}

