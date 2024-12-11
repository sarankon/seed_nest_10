import { Module } from '@nestjs/common';
import { SwaggerController } from './swagger/swagger.controller';
import { SampleModule } from './sample/sample.module';

@Module({
  controllers: [SwaggerController],
  imports: [SampleModule]
})
export class DemoModule {}
