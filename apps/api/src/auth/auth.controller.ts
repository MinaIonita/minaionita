import { Body, Controller, Get, Post, Req, UseGuards } from "@nestjs/common";
import { Throttle } from "@nestjs/throttler";
import {
  IsEmail,
  IsOptional,
  IsString,
  Length,
  MinLength,
} from "class-validator";
import { AuthService } from "./auth.service";
import { JwtAuthGuard } from "./jwt-auth.guard";

class LoginDto {
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(6)
  password!: string;

  // Present on the second step when 2FA is enabled.
  @IsOptional()
  @IsString()
  @Length(6, 6)
  code?: string;
}

class CodeDto {
  @IsString()
  @Length(6, 6)
  code!: string;
}

type Req2 = { user: { userId: string } };

@Controller("auth")
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  // Tight limit: 8 login attempts / minute / IP (brief §7).
  @Throttle({ default: { limit: 8, ttl: 60_000 } })
  @Post("login")
  login(@Body() dto: LoginDto) {
    return this.auth.login(dto.email, dto.password, dto.code);
  }

  @UseGuards(JwtAuthGuard)
  @Get("me")
  me(@Req() req: Req2) {
    return this.auth.me(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post("2fa/start")
  start2fa(@Req() req: Req2) {
    return this.auth.startTwoFactor(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post("2fa/confirm")
  confirm2fa(@Req() req: Req2, @Body() dto: CodeDto) {
    return this.auth.confirmTwoFactor(req.user.userId, dto.code);
  }

  @UseGuards(JwtAuthGuard)
  @Post("2fa/disable")
  disable2fa(@Req() req: Req2, @Body() dto: CodeDto) {
    return this.auth.disableTwoFactor(req.user.userId, dto.code);
  }
}
