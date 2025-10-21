// src/auth/auth.service.ts
import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Admin } from './entities/auth.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Admin)
    private adminRepository: Repository<Admin>,
    private jwtService: JwtService,
  ) {}

   async validateAdmin(username: string, password: string): Promise<any> {
    const admin = await this.adminRepository.findOne({ where: { username } });
    
    if (admin && await admin.validatePassword(password)) {
      const { password, salt, ...result } = admin;
      return result;
    }
    return null;
  }

   async login(admin: any) {
    const payload = { username: admin.username, sub: admin.id, role: 'admin' };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: admin.id,
        username: admin.username,
      },
    };
  }

async createAdmin(username: string, password: string): Promise<Partial<Admin>> {
    const existingAdmin = await this.adminRepository.findOne({ where: { username } });
    if (existingAdmin) {
      throw new ConflictException('Username already exists');
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    
    const admin = this.adminRepository.create({
      username,
      password: hashedPassword,
      salt,
    });
    
    const savedAdmin = await this.adminRepository.save(admin);
    const { password: _, salt: __, ...result } = savedAdmin;
    return result;
  }
}