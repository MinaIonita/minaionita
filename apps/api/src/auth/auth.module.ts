import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { jwtSecret } from "../config/env";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { JwtStrategy } from "./jwt.strategy";

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      // No fallback: an unset secret must stop the boot, not sign tokens with a
      // published default. Enforced in validateEnv() before the app is created.
      secret: jwtSecret(),
      // jsonwebtoken types accept `number | ms-string`; env is a plain string.
      signOptions: {
        expiresIn: (process.env.JWT_EXPIRES ?? "7d") as `${number}d`,
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
