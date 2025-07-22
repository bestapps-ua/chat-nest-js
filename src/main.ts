import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe, VersioningType } from '@nestjs/common';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);


    app.enableCors();
    app.enableVersioning({
        type: VersioningType.URI,
    });
    app.setGlobalPrefix('v1/api');

    app.useGlobalPipes(
      new ValidationPipe({
          transform: true, // This is crucial!
      }),
    );

    const config = new DocumentBuilder()
        .setTitle('Chat example')
        .setDescription('The API description')
        .setVersion('1.0')
        .addBearerAuth()
        .build()
    ;
    const documentFactory = () => SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, documentFactory);
    SwaggerModule.setup('swagger', app, documentFactory, {
        jsonDocumentUrl: 'swagger/json',
    });
    await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
