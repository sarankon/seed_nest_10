import { Module } from '@nestjs/common';
import { SwaggerController } from './swagger/swagger.controller';
import { UsersModule } from './users/users.module';

@Module({
  controllers: [SwaggerController],
  imports: [UsersModule]
})
export class DemoModule {}
