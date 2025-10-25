// src/auth/auth.controller.ts
import { Controller, Post, UseGuards, Request, Body, HttpCode } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
constructor(private authService: AuthService) {}

 @Post('login')
  @HttpCode(200)
  @UseGuards(AuthGuard('local'))
  @ApiOperation({ summary: 'auth login' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({ 
    status: 200, 
    description: 'Login successful',
    schema: {
      example: {
        access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        user: {
          id: 1,
          username: 'admin'
        }
      }
    }
  })

  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async login(@Request() req, @Body() loginDto: LoginDto) {
    return this.authService.login(req.user);
  }

@Post('register')
  @ApiOperation({ summary: 'Create admin user (first time setup)' })
  @ApiResponse({ 
    status: 201, 
    description: 'Admin created successfully',
    schema: {
      example: {
        id: 1,
        username: 'admin',
        createdAt: '2023-01-01T00:00:00.000Z'
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Username already exists' })
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.createAdmin(registerDto.username, registerDto.password);
  }

  @Post('validate')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Validate JWT token' })
  @ApiResponse({ 
    status: 200, 
    description: 'Token is valid',
    schema: {
      example: {
        valid: true,
        user: {
          userId: 1,
          username: 'admin',
          role: 'admin'
        }
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Invalid token' })
  async validateToken(@Request() req) {
    return { valid: true, user: req.user };
  }
}
