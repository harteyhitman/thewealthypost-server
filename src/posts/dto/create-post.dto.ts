// src/blog-posts/dto/create-blog-post.dto.ts
import { 
  IsString, 
  IsOptional, 
  IsBoolean, 
  IsNotEmpty, 
  MinLength, 
  MaxLength,
  IsUrl
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePostDto {
  @ApiProperty({ 
    example: 'My First Blog Post',
    description: 'The title of the blog post',
    minLength: 5,
    maxLength: 255
  })
  @IsString()
  @IsNotEmpty({ message: 'Title is required' })
  @MinLength(5, { message: 'Title must be at least 5 characters long' })
  @MaxLength(255, { message: 'Title cannot be longer than 255 characters' })
  title: string;

  @ApiProperty({ 
    example: 'This is the content of my first blog post.',
    description: 'The main content of the blog post',
    minLength: 10
  })
  @IsString()
  @IsNotEmpty({ message: 'Content is required' })
  @MinLength(10, { message: 'Content must be at least 10 characters long' })
  content: string;

  @ApiPropertyOptional({ 
    example: 'A brief summary of the blog post',
    description: 'Short excerpt or summary',
    maxLength: 500
  })
  @IsOptional()
  @IsString()
  @MaxLength(500, { message: 'Excerpt cannot be longer than 500 characters' })
  excerpt?: string;

  @ApiPropertyOptional({ 
    example: 'blog, first-post, tutorial',
    description: 'Comma-separated tags for categorization'
  })
  @IsOptional()
  @IsString()
  tags?: string;

  @ApiPropertyOptional({ 
    example: 'my-first-blog-post',
    description: 'URL-friendly slug for the post'
  })
  @IsOptional()
  @IsString()
  slug?: string;

  @ApiPropertyOptional({ 
    example: 'https://example.com/images/featured.jpg',
    description: 'URL to the featured image',
    nullable: true
  })
  @IsOptional()
  @IsString()
  @IsUrl({}, { message: 'Featured image must be a valid URL' })
  featuredImage?: string | null;

  @ApiPropertyOptional({ 
    example: false,
    description: 'Whether the post is published or draft',
    default: false
  })
  @IsOptional()
  @IsBoolean()
  published?: boolean = false;
}