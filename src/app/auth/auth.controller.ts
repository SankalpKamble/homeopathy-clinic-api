import { Body, Controller, Post, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthPayloadDto } from './dto'
import { AuthService } from './auth.service';
import { AppLogger } from '../common';

@Controller(AuthController.api)
export class AuthController {
    static api = 'api';
    private readonly logger: AppLogger;

    constructor(
        private readonly authService: AuthService,
        private readonly configService: ConfigService,
    ) {
        this.logger = new AppLogger(AuthController.name, configService.get<string>('AUTH_LOG_PREFIX'));
    }

    @Post('/login')
    async login(@Body() authPayload: AuthPayloadDto) {
        this.logger.log(`POST /api/login - email: ${authPayload.email}`);
        const user = await this.authService.authentication(authPayload);
        if (!user) {
            this.logger.warn(`POST /api/login failed - no token returned`);
            throw new HttpException('Invalid username or password', HttpStatus.UNAUTHORIZED);
        }
        this.logger.log(`POST /api/login success for ${authPayload.email}`);
        return {
            token: user
        };
    }

    @Post("/register")
    async register(@Body() authPayload: AuthPayloadDto) {
        this.logger.log(`POST /api/register - email: ${authPayload.email}`);
        const result = await this.authService.register(authPayload);
        if (!result.user && !result.session) {
            this.logger.warn(`POST /api/register failed - no user or session returned`);
            throw new HttpException('Registration failed', HttpStatus.BAD_REQUEST);
        }
        this.logger.log(`POST /api/register success for ${authPayload.email}`);
        return {
            message: 'Registration successful',
            statusCode: HttpStatus.OK,
        };
    }
}
