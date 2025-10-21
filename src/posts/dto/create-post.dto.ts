import { 
  IsString, 
  IsOptional, 
  IsBoolean, 
  IsNotEmpty, 
  MinLength, 
  MaxLength,
  IsUrl
} from 'class-validator';

export class CreatePostDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(5, { message: 'Title must be at least 5 characters long' })
  @MaxLength(255, { message: 'Title cannot be longer than 255 characters' })
  title: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(10, { message: 'Content must be at least 10 characters long' })
  content: string;

  @IsOptional()
  @IsString()
  @MaxLength(500, { message: 'Excerpt cannot be longer than 500 characters' })
  excerpt?: string;

  @IsOptional()
  @IsString()
  @IsUrl({}, { message: 'Featured image must be a valid URL' })
  featuredImage?: string | null;

  @IsOptional()
  @IsBoolean()
  published?: boolean;
}