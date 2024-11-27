import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtPayLoad } from './interfaces';
import { LoginUserDto } from './dto/login-user.dto';
import * as bcrypt from 'bcrypt'
import { FAKE_USERS, User } from './dto/user.dto';

@Injectable()
export class AuthService {

  constructor(
    // @InjectRepository(User)
    // private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService
  ) { }

  async login(loginUserDto: LoginUserDto) {

    const { password, email } = loginUserDto

    // const user = await this.userRepository.findOneBy({ email });

    const user:User = FAKE_USERS.find(user => user.email === email);

    if ( !user ) {
      throw new UnauthorizedException(`Credentials are not valid (email)`)
    }

    if ( !bcrypt.compareSync(password, user.password) ){
      throw new UnauthorizedException(`Credentials are not valid (password)`)
    }

    return {
      ...user,
      token: this.getJwtToken({ id: user.id })
    };

  }

  //sirve para renovar el token devuelve un nuevo token
  async checkAuthStatus(user: User){

    return {
      ...user,
      token: this.getJwtToken({ id: user.id })
    };
  }

  private getJwtToken(payload: JwtPayLoad) {
    const token = this.jwtService.sign(payload);
    return token;
  }
}
