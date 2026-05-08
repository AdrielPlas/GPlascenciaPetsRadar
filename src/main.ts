// Application Insights debe inicializarse antes de cualquier otro import
import * as appInsights from 'applicationinsights';
import { envs } from './config/envs';

if (envs.APPINSIGHTS_CONNECTION_STRING) {
  appInsights
    .setup(envs.APPINSIGHTS_CONNECTION_STRING)
    .setAutoDependencyCorrelation(true)
    .setAutoCollectRequests(true)
    .setAutoCollectPerformance(true, true)
    .setAutoCollectExceptions(true)
    .setAutoCollectDependencies(true)
    .setAutoCollectConsole(true, true)
    .setSendLiveMetrics(true)
    .start();
}

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.enableCors();
  await app.listen(envs.PORT);
  console.log(`🐾 PetRadar corriendo en http://localhost:${envs.PORT}/api`);
}
bootstrap();
