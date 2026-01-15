import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GeminiService } from './gemini/gemini.service';
import { AnalyzeController } from './analyze/analyze.controller';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Makes variables available across all modules
    }),
  ],
  controllers: [AppController, AnalyzeController],
  providers: [AppService, GeminiService],
})
export class AppModule {}
