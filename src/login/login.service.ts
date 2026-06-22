import { Injectable, HttpStatus } from '@nestjs/common';
import { CreateLoginDto } from './dto/create-login.dto';

@Injectable()
export class LoginService {
  create(createLoginDto: CreateLoginDto) {
    console.log(createLoginDto);
    if (createLoginDto.username === 'admin' && createLoginDto.password === 'admin') {
      return { statusCode: HttpStatus.OK, message: 'Logged in Successfully' };
    } else {
      return { statusCode: HttpStatus.UNAUTHORIZED, message: 'Invalid Credentials' };
    }
  }

  findAll() {
    return `This action returns all login`;
  }

  findOne(id: number) {
    return `This action returns a #${id} login`;
  }
  remove(id: number) {
    return `This action removes a #${id} login`;
  }
}
