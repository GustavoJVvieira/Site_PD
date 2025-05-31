import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Request, Response, NextFunction } from 'express'; // Importar tipos do Express

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Middleware personalizado para CORS
  app.use((req: Request, res: Response, next: NextFunction) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:5173');
    res.header(
      'Access-Control-Allow-Methods',
      'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    );
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.header('Access-Control-Allow-Credentials', 'true');

    // Responder imediatamente às requisições OPTIONS
    if (req.method === 'OPTIONS') {
      return res.status(204).send();
    }

    next();
  });

  console.log('CORS configurado para origin: http://localhost:5173');
  await app.listen(3000);
}
bootstrap();
