import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { LoginService } from './login.service';
import { CreateLoginDto } from './dto/create-login.dto';

const URL = 'api/login';
@Controller(URL)
export class LoginController {
  constructor(private readonly loginService: LoginService) {}

  @Post('/register')
  create(@Body() createLoginDto: CreateLoginDto) {
    return this.loginService.create(createLoginDto);
  }

  @Post('/login')
  authenticate(@Body() createLoginDto: CreateLoginDto) {
    return this.loginService.authenticate(createLoginDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.loginService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.loginService.remove(+id);
  }
}
