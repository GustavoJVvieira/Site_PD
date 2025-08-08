// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Use a URL do seu frontend do Netlify aqui.
  // Remova a barra final, pois não é necessária.
  const netlifyUrl = 'https://pdteacher.netlify.app';

  // Configuração correta do CORS usando o método nativo do NestJS.
  app.enableCors({
    origin: netlifyUrl,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // Utilize a variável de ambiente PORT para a porta do servidor, com fallback para 3000.
  await app.listen(process.env.PORT || 3000);
}
bootstrap();