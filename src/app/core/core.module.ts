import { Module } from '@nestjs/common';
import { PrismaClientModule } from 'src/data-sources';
import { PatientController } from './controller/patient.controller';
import * as controllers from './controller';
import * as service from './service';
import * as repositories from './repository';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [PrismaClientModule, AuthModule],
  controllers: [...Object.values(controllers)],
  providers: [...Object.values(service),...Object.values(repositories)],
  exports: [...Object.values(service),...Object.values(repositories)],
})
export class CoreModule {}
