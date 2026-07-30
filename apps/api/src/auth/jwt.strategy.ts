import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { jwtSecret } from "../config/env";

export type JwtPayload = { sub: string; role: string };

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      // Must match auth.module — and must never fall back to a default.
      secretOrKey: jwtSecret(),
    });
  }

  // Whatever this returns becomes request.user.
  validate(payload: JwtPayload) {
    return { userId: payload.sub, role: payload.role };
  }
}
