import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BlogPost } from './entities/post.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class BlogService {
  constructor(
    @InjectRepository(BlogPost)
    private blogRepo: Repository<BlogPost>,
  ) {}

  async create(dto: CreatePostDto): Promise<BlogPost> {
    const post = this.blogRepo.create(dto);
    return await this.blogRepo.save(post);
  }

  async findAll(): Promise<BlogPost[]> {
    return await this.blogRepo.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<BlogPost> {
    const post = await this.blogRepo.findOne({ where: { id } });
    if (!post) throw new NotFoundException('Post not found');
    return post;
  }

  async update(id: number, dto: UpdatePostDto): Promise<BlogPost> {
    await this.blogRepo.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.blogRepo.delete(id);
  }
}
