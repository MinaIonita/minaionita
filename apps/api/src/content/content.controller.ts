import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common";
import type { Prisma } from "@prisma/client";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { ContentService } from "./content.service";

/** Public read endpoints — the site fetches from here (published only). */
@Controller("content")
export class ContentController {
  constructor(private readonly content: ContentService) {}

  @Get("services")
  services() {
    return this.content.services();
  }

  @Get("services/:slug")
  service(@Param("slug") slug: string) {
    return this.content.service(slug);
  }

  @Get("testimonials")
  testimonials() {
    return this.content.testimonials();
  }

  @Get("portfolio")
  portfolio() {
    return this.content.portfolio();
  }
}

/** Admin CRUD — everything editable without touching code (brief §4). */
@UseGuards(JwtAuthGuard)
@Controller("admin/content")
export class AdminContentController {
  constructor(private readonly content: ContentService) {}

  @Get("services")
  services() {
    return this.content.adminServices();
  }

  @Get("services/:id")
  service(@Param("id") id: string) {
    return this.content.adminService(id);
  }

  @Post("services")
  createService(@Body() data: Prisma.ServiceCreateInput) {
    return this.content.createService(data);
  }

  @Patch("services/:id")
  updateService(
    @Param("id") id: string,
    @Body() data: Prisma.ServiceUpdateInput,
  ) {
    return this.content.updateService(id, data);
  }

  @Delete("services/:id")
  deleteService(@Param("id") id: string) {
    return this.content.deleteService(id);
  }

  @Get("portfolio")
  portfolio() {
    return this.content.adminPortfolio();
  }

  @Get("portfolio/:id")
  portfolioItem(@Param("id") id: string) {
    return this.content.adminPortfolioItem(id);
  }

  @Patch("portfolio/:id")
  updatePortfolio(
    @Param("id") id: string,
    @Body() data: Prisma.PortfolioItemUpdateInput,
  ) {
    return this.content.updatePortfolioItem(id, data);
  }

  @Get("testimonials")
  testimonials() {
    return this.content.testimonials(false);
  }

  @Post("testimonials")
  createTestimonial(@Body() data: Prisma.TestimonialCreateInput) {
    return this.content.createTestimonial(data);
  }

  @Patch("testimonials/:id")
  updateTestimonial(
    @Param("id") id: string,
    @Body() data: Prisma.TestimonialUpdateInput,
  ) {
    return this.content.updateTestimonial(id, data);
  }

  @Delete("testimonials/:id")
  deleteTestimonial(@Param("id") id: string) {
    return this.content.deleteTestimonial(id);
  }
}
