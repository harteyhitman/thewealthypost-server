import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseInterceptors,
  UploadedFile,
  ParseIntPipe,
  UseGuards,
  Request
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';

import { AdminGuard } from '../auth/admin.guard';
import { BlogService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@ApiTags('posts')
@Controller('blog')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Get()
   @ApiOperation({ summary: 'Get all blog posts' })
  @ApiResponse({ 
    status: 200, 
    description: 'List of all blog posts',
    schema: {
      example: [
        {
          id: 1,
          title: 'My First Post',
          content: 'Post content',
          tags: 'blog,first',
          slug: 'my-first-post',
          createdAt: '2023-01-01T00:00:00.000Z',
          updatedAt: '2023-01-01T00:00:00.000Z'
        }
      ]
    }
  })
  getAll() {
    return this.blogService.findAll();
  }

  @Get(':id')
    @ApiOperation({ summary: 'Get a single blog post by ID' })
  @ApiParam({ name: 'id', type: 'number', description: 'Blog post ID' })
  @ApiResponse({ status: 200, description: 'Blog post found' })
  @ApiResponse({ status: 404, description: 'Blog post not found' })
  getOne(@Param('id', ParseIntPipe) id: number) {
    return this.blogService.findOne(id);
  }

@Post()
@UseGuards(AdminGuard)
@UseInterceptors(FileInterceptor('featuredImage', {
  storage: diskStorage({
    destination: './uploads/blog',
    filename: (req, file, callback) => {
      const uniqueName = `${Date.now()}${extname(file.originalname)}`;
      callback(null, uniqueName);
    },
  }),
}))
@ApiBearerAuth('JWT-auth')
@ApiOperation({ summary: 'Create a new blog post (Admin only)' })
@ApiResponse({ 
  status: 201, 
  description: 'Blog post created successfully' 
})
@ApiResponse({ status: 401, description: 'Unauthorized' })
async createPost(
  @UploadedFile() file: Express.Multer.File,
  @Body() createPostDto: CreatePostDto,
  @Request() req
) {
  const imagePath = file ? `/uploads/blog/${file.filename}` : null;
  
  // Combine the DTO with user info and image path
  const postData = {
    ...createPostDto,
    featuredImage: imagePath,
    authorId: req.user.id, // or userId, depending on your user object structure
  };

  return this.blogService.create(postData);
}
@Patch(':id')
  @UseGuards(AdminGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update a blog post (Admin only)' })
  @ApiParam({ name: 'id', type: 'number', description: 'Blog post ID' })
  @ApiResponse({ status: 200, description: 'Blog post updated' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Blog post not found' })
  async updatePost(
    @Param('id') id: number,
    @Body() updatePostDto: CreatePostDto,
    @Request() req
  ) {
    return this.blogService.update(id, req.user);
  }

  @Delete(':id')
  @UseGuards(AdminGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Delete a blog post (Admin only)' })
  @ApiParam({ name: 'id', type: 'number', description: 'Blog post ID' })
  @ApiResponse({ status: 200, description: 'Blog post deleted' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Blog post not found' })
  async deletePost(@Param('id') id: number, @Request() req) {
    return this.blogService.remove( req.user);
  }
}
