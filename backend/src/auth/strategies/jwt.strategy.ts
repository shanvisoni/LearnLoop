// import { Injectable, UnauthorizedException } from '@nestjs/common';
// import { PassportStrategy } from '@nestjs/passport';
// import { ExtractJwt, Strategy } from 'passport-jwt';
// import { UsersService } from 'src/users/users.services';
// import { ConfigService } from '@nestjs/config'; // Add this

// @Injectable()
// export class JwtStrategy extends PassportStrategy(Strategy) {
//   constructor(
//     private userService: UsersService,
//     private configService: ConfigService, // Add this
//   ) {
//     super({
//       jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
//       ignoreExpiration: false,
//       secretOrKey: configService.getOrThrow<string>('JWT_SECRET'), // Changed this
//     });
//   }

//   async validate(payload: any) {
//     const user = await this.userService.findById(payload.sub);
//     if (!user) {
//       throw new UnauthorizedException();
//     }
//     // return user;
//     return {
//       id: (user as any)._id.toString(),
//       username: user.username,
//       email: user.email,
//       firstName: user.firstName,
//       lastName: user.lastName,
//       // ... other fields you need
//     };
//   }
// }

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from '../../users/users.services';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from '../../common/interfaces/jwt-payload.interfaces';
import {
  AUTH_MESSAGES,
  JWT_STRATEGY_NAME,
} from '../../common/constants/auth.constants';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, JWT_STRATEGY_NAME) {
  constructor(
    private readonly userService: UsersService,
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow('JWT_SECRET'),
    });
  }

  async validate(payload: JwtPayload) {
    const user = await this.userService.findById(payload.sub);

    if (!user) {
      throw new UnauthorizedException(AUTH_MESSAGES.UNAUTHORIZED);
    }

    return {
      id: (user as any)._id.toString(),
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    };
  }
}
