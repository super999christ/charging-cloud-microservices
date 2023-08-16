import { Module } from '@nestjs/common';
import { AuthenticationModule } from '../authentication/authentication.module';
import { AppController } from './app.controller';

@Module({
  controllers: [AppController],
  imports: [AuthenticationModule]
})
export class AppModule {}
