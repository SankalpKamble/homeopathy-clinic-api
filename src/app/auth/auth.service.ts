import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthPayloadDto } from './dto/auth.dto';
import { DBPrismaClient } from 'src/data-sources/clients/db-prisma-client';
import { SupabaseClient } from '@supabase/supabase-js';
import { AppLogger } from '../common';

@Injectable()
export class AuthService {
    private readonly logger: AppLogger;

    constructor(
        @Inject('SUPABASE_CLIENT') private readonly supabase: SupabaseClient,
        private prisma: DBPrismaClient,
        private readonly configService: ConfigService,
    ) {
        this.logger = new AppLogger(AuthService.name, configService.get<string>('AUTH_LOG_PREFIX'));
    }

    async authentication(authPayload: AuthPayloadDto) {
        const { email, password } = authPayload;

        this.logger.log(`Login attempt: ${email}`);

        const { data, error } = await this.supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error || !data.session) {
            this.logger.warn(`Login failed for ${email}: ${error?.message ?? 'No session returned'}`);
            throw new UnauthorizedException('Invalid credentials');
        }

        this.logger.log(`Login successful: ${email}`);
        return data.session.access_token;
    }

    async register(authPayload: AuthPayloadDto) {
        const { email, password } = authPayload;

        this.logger.log(`Registration attempt: ${email}`);

        const { data, error } = await this.supabase.auth.signUp({
            email,
            password,
        });

        if (error) {
            this.logger.warn(`Registration failed for ${email}: ${error.message}`);
            throw new UnauthorizedException(error.message);
        }

        this.logger.log(`Registration successful: ${email}`);
        return {
            user: data.user,
            session: data.session,
        };
    }
}
