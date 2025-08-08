import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { GeminiModule } from './gemini/gemini.module';
import { AulaCurriculoModule } from './aula-curriculo/aula-curriculo.module'; 
import { AulaCurriculoEntity } from './aula-curriculo/aula-curriculo.entity'; 
import { SlidesModule } from './slides/slides.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env.development.local'],
      isGlobal: true,
      ignoreEnvFile: false,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      database: 'pdteacher', 
      host: 'dpg-d24htp63jp1c73aof44g-a.oregon-postgres.render.com', 
      password: 'sQr41TGou6PUSI4AnwfsJwLRRJh6Atyi',       
      port: 5432, 
      username: 'pdteacher', 
      synchronize: false,
      entities: [
        AulaCurriculoEntity, 
        `${__dirname}/**/entity/*.entity{.js,.ts}` 
      ],
      migrations: [`${__dirname}/**/migration/*{.ts,.js}`],
      migrationsRun: true,
      ssl: {
        rejectUnauthorized: false, 
      },
    }),
    UsersModule,
    AuthModule,
    GeminiModule,
    
    AulaCurriculoModule,
    
    SlidesModule, 
  ],
  controllers: [AppController], 
  providers: [AppService], 
})
export class AppModule {}
