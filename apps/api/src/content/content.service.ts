import { Injectable, NotFoundException } from "@nestjs/common";
import { type Prisma, Status } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";

/**
 * Serves the collections the public site consumes. The rich per-service detail
 * lives in the Service.body Json column — the brief's "modular content blocks".
 * Read endpoints return only PUBLISHED rows; admin sees everything.
 */
@Injectable()
export class ContentService {
  constructor(private readonly prisma: PrismaService) {}

  // ── Services ──────────────────────────────────────────────────────────
  async services(publishedOnly = true) {
    const rows = await this.prisma.service.findMany({
      where: publishedOnly ? { status: Status.PUBLISHED } : undefined,
      orderBy: { order: "asc" },
    });
    return rows.map((s) => {
      const body = (s.body ?? {}) as Record<string, unknown>;
      return {
        slug: s.slug,
        title: s.title,
        summary: s.summary,
        icon: body.icon ?? null,
        featured: s.featured,
        order: s.order,
        status: s.status,
      };
    });
  }

  async service(slug: string, publishedOnly = true) {
    const row = await this.prisma.service.findFirst({
      where: { slug, ...(publishedOnly ? { status: Status.PUBLISHED } : {}) },
    });
    if (!row) throw new NotFoundException();
    return {
      slug: row.slug,
      title: row.title,
      summary: row.summary,
      ...(row.body as object),
    };
  }

  /** Admin list: raw rows with id + body, so the panel can edit everything. */
  adminServices() {
    return this.prisma.service.findMany({ orderBy: { order: "asc" } });
  }

  async adminService(id: string) {
    const row = await this.prisma.service.findUnique({ where: { id } });
    if (!row) throw new NotFoundException();
    return row;
  }

  createService(data: Prisma.ServiceCreateInput) {
    return this.prisma.service.create({ data });
  }

  async updateService(id: string, data: Prisma.ServiceUpdateInput) {
    await this.exists("service", id);
    return this.prisma.service.update({ where: { id }, data });
  }

  async deleteService(id: string) {
    await this.exists("service", id);
    return this.prisma.service.delete({ where: { id } });
  }

  // ── Portfolio ─────────────────────────────────────────────────────────
  /** Public: flatten body Json into the front's Project shape. */
  async portfolio(publishedOnly = true) {
    const rows = await this.prisma.portfolioItem.findMany({
      where: publishedOnly ? { status: Status.PUBLISHED } : undefined,
      orderBy: { order: "asc" },
    });
    return rows.map((p) => {
      const body = (p.body ?? {}) as Record<string, unknown>;
      return {
        slug: p.slug,
        client: p.client,
        category: p.category,
        url: p.liveUrl ?? "",
        tech: (p.tech as string[]) ?? [],
        featured: p.featured,
        ...body,
      };
    });
  }

  adminPortfolio() {
    return this.prisma.portfolioItem.findMany({ orderBy: { order: "asc" } });
  }

  async adminPortfolioItem(id: string) {
    const row = await this.prisma.portfolioItem.findUnique({ where: { id } });
    if (!row) throw new NotFoundException();
    return row;
  }

  updatePortfolioItem(id: string, data: Prisma.PortfolioItemUpdateInput) {
    return this.prisma.portfolioItem.update({ where: { id }, data });
  }

  // ── Testimonials ──────────────────────────────────────────────────────
  testimonials(publishedOnly = true) {
    return this.prisma.testimonial.findMany({
      where: publishedOnly ? { featured: true } : undefined,
      orderBy: { order: "asc" },
    });
  }

  createTestimonial(data: Prisma.TestimonialCreateInput) {
    return this.prisma.testimonial.create({ data });
  }

  async updateTestimonial(id: string, data: Prisma.TestimonialUpdateInput) {
    await this.exists("testimonial", id);
    return this.prisma.testimonial.update({ where: { id }, data });
  }

  async deleteTestimonial(id: string) {
    await this.exists("testimonial", id);
    return this.prisma.testimonial.delete({ where: { id } });
  }

  /** Existence check before an update/delete, so a bad id is a 404 rather than a
   *  Prisma exception. Dispatched explicitly instead of indexing the client by a
   *  string: the dynamic form needed a ts-expect-error, which typed the result as
   *  `error` and silently disabled checking on the whole call. */
  private async exists(model: "service" | "testimonial", id: string) {
    const found =
      model === "service"
        ? await this.prisma.service.findUnique({
            where: { id },
            select: { id: true },
          })
        : await this.prisma.testimonial.findUnique({
            where: { id },
            select: { id: true },
          });
    if (!found) throw new NotFoundException();
  }
}
