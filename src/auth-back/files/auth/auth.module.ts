import { ConfigModule, ConfigService } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';


@Module({
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  imports: [
    ConfigModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          //secret: configService.get('JWT_SECRET'),//Se obtiene variable de entorno
          secret: "S3CR3T-P4S5W0RD",
          signOptions: {
            expiresIn: '2h'
          }
        }
      }
    })
  ],
  exports: [JwtStrategy, PassportModule, JwtModule]

})
export class AuthModule { }
