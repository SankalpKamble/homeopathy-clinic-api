import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient } from '@supabase/supabase-js';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthGuard } from './guard/auth.guard';
import { PrismaClientModule } from 'src/data-sources';

@Module({
  imports: [PrismaClientModule],
  controllers: [AuthController],
  providers: [
    AuthService,
    AuthGuard,
    {
      provide: 'SUPABASE_CLIENT',
      useFactory: (configService: ConfigService) =>
        createClient(
          configService.get<string>('SUPABASE_URL')!,
          configService.get<string>('SUPABASE_PUBLISHABLE_KEY')!,
        ),
      inject: [ConfigService],
    },
  ],
})
export class AuthModule {}
