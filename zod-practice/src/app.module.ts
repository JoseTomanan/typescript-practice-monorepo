import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BuildingModule } from './building/building.module';

@Module({
  imports: [BuildingModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
