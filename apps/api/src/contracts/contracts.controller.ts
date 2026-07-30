import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from "@nestjs/common";
import type { Prisma } from "@prisma/client";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { ContractsService } from "./contracts.service";

@UseGuards(JwtAuthGuard)
@Controller("admin/contracts")
export class ContractsController {
  constructor(private readonly contracts: ContractsService) {}

  @Get("templates")
  templates() {
    return this.contracts.templates();
  }

  // ANAF lookup by CUI (brief §5bis).
  @Get("anaf")
  anaf(@Query("cui") cui: string) {
    return this.contracts.anafLookup(cui);
  }

  @Get()
  list() {
    return this.contracts.list();
  }

  @Get(":id")
  get(@Param("id") id: string) {
    return this.contracts.get(id);
  }

  @Post()
  create(@Body() data: Omit<Prisma.ContractCreateInput, "number">) {
    return this.contracts.create(data);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() data: Prisma.ContractUpdateInput) {
    return this.contracts.update(id, data);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.contracts.remove(id);
  }
}
