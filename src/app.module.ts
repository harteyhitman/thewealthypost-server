import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlogModule } from './posts/posts.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { Admin } from './auth/entities/auth.entity';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
TypeOrmModule.forRootAsync({
  imports: [ConfigModule],
  useFactory: (configService: ConfigService) => {
    console.log('Database Config:', {
      host: configService.get('DB_HOST'),
      port: configService.get('DB_PORT'),
      username: configService.get('DB_USERNAME'),
      password: configService.get('DB_PASSWORD'),
      database: configService.get('DB_NAME'), // or DB_DATABASE
    });
    
    return {
      type: 'mysql',
      host: configService.get<string>('DB_HOST'),
      port: parseInt(configService.get<string>('DB_PORT') || '3306', 10),
      username: configService.get<string>('DB_USERNAME'),
      password: configService.get<string>('DB_PASSWORD'),
      database: configService.get<string>('DB_NAME'), // Make sure this matches .env
      autoLoadEntities: true,
      // synchronize: true,
      entities: [__dirname + '/**/*.entity{.ts,.js}', Admin],
    };
  },
  inject: [ConfigService],
}),
    BlogModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
