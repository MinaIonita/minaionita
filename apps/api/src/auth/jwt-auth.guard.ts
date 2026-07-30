import { Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

/** Guards admin routes — a valid Bearer JWT is required. */
@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") {}
