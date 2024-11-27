import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { JwtPayLoad } from "../interfaces/jwt-payload.interface";
import { FAKE_USERS, User } from '../dto/user.dto';

//Se importa en el provider, NestJS lo usa automaticamente en las peticiones que tengo con seguridad
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {

    constructor(
        // @InjectRepository(User)
        // private readonly userRepository: Repository<User>,
        configService: ConfigService
    ) {
        super({
            // secretOrKey: configService.get('JWT_SECRET'),
            secretOrKey: "S3CR3T-P4S5W0RD",
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
        });
    }

    //se valida el token y se mira si el usuario está activo
    //TODO: Crear un UserRepository para traer los datos dinamicamente
    async validate(payload: JwtPayLoad): Promise<User & { permissions: string[] }> {

        const { id } = payload;

        const user = FAKE_USERS.find(user =>  user.id = id );

        if (!user) {
            throw new UnauthorizedException('Token not valid')
        }

        if (!user.isActive) {
            throw new UnauthorizedException('User is inactive, talk with an admin')
        }

        const permissions = new Set<string>();
        user.roles.forEach((role)=> {
            role.permissions.forEach((permission)=>{
                permissions.add(permission.name);
            })
        })


        return {
            ...user,
            permissions: Array.from(permissions)
        };
    }

}