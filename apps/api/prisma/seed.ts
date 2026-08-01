import "dotenv/config";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient, Status } from "@prisma/client";
import * as bcrypt from "bcryptjs";
// One source of truth: seed straight from the front's content so the DB starts
// identical to what the site currently renders.
import {
  projects,
  serviceDetails,
  services,
  testimonials,
} from "../../web/src/lib/content";
import { primaryCta, site } from "../../web/src/lib/site";

// Același adaptor ales dinamic ca în PrismaService: hardcodat pe SQLite, seed-ul
// refuza să ruleze pe baza de producție cu „adapter based on sqlite is not
// compatible with provider mysql".
const dbUrl = process.env.DATABASE_URL;
if (!dbUrl) throw new Error("DATABASE_URL is not set");
const isSqlite = dbUrl.startsWith("file:") || dbUrl.startsWith("sqlite:");

const prisma = new PrismaClient({
  adapter: isSqlite
    ? new PrismaBetterSqlite3({ url: dbUrl })
    : new PrismaMariaDb(dbUrl),
});

async function main() {
  // ── Admin user ──
  const email = (process.env.ADMIN_EMAIL ?? "mina.ionita1@gmail.com").toLowerCase();
  const password = process.env.ADMIN_PASSWORD ?? "schimba-ma-acum";
  await prisma.adminUser.upsert({
    where: { email },
    update: {},
    create: {
      email,
      name: site.name,
      passwordHash: await bcrypt.hash(password, 12),
      role: "ADMIN",
    },
  });
  console.log(`✓ admin: ${email}`);

  // ── Global settings ──
  const settings: Record<string, unknown> = {
    site: {
      name: site.name,
      tagline: site.tagline,
      description: site.description,
      email: site.email,
      phone: site.phone,
      phoneHref: site.phoneHref,
      whatsapp: site.whatsapp,
      city: site.city,
      country: site.country,
      legal: site.legal,
      socials: site.socials,
    },
    cta: primaryCta,
  };
  for (const [key, value] of Object.entries(settings)) {
    await prisma.setting.upsert({
      where: { key },
      update: { value: value as object },
      create: { key, value: value as object },
    });
  }
  console.log(`✓ settings: ${Object.keys(settings).join(", ")}`);

  // ── Services (grid fields as columns, rich detail in body Json) ──
  for (const [i, s] of services.entries()) {
    const detail = serviceDetails[s.slug];
    await prisma.service.upsert({
      where: { slug_locale: { slug: s.slug, locale: "RO" } },
      update: {
        title: s.title,
        summary: s.summary,
        body: { icon: s.icon, ...(detail ?? {}) },
        order: i,
        status: Status.PUBLISHED,
      },
      create: {
        slug: s.slug,
        locale: "RO",
        title: s.title,
        summary: s.summary,
        body: { icon: s.icon, ...(detail ?? {}) },
        order: i,
        status: Status.PUBLISHED,
        publishedAt: new Date(),
      },
    });
  }
  console.log(`✓ services: ${services.length}`);

  // ── Portfolio (front shape in body Json, queryable fields as columns) ──
  for (const [i, pr] of projects.entries()) {
    const data = {
      slug: pr.slug,
      locale: "RO" as const,
      client: pr.client,
      category: pr.category,
      liveUrl: pr.url,
      tech: pr.tech,
      featured: pr.featured ?? false,
      order: i,
      status: Status.PUBLISHED,
      body: {
        icon: pr.icon,
        tagline: pr.tagline,
        year: pr.year,
        description: pr.description,
      },
    };
    await prisma.portfolioItem.upsert({
      where: { slug_locale: { slug: pr.slug, locale: "RO" } },
      update: data,
      create: { ...data, publishedAt: new Date() },
    });
  }
  console.log(`✓ portfolio: ${projects.length}`);

  // ── Testimonials ──
  // Clear + reinsert: the source list is small and has no stable id yet.
  await prisma.testimonial.deleteMany({});
  for (const [i, t] of testimonials.entries()) {
    await prisma.testimonial.create({
      data: {
        quote: t.quote,
        author: t.author,
        role: t.role,
        featured: true,
        order: i,
      },
    });
  }
  console.log(`✓ testimonials: ${testimonials.length}`);
}

main()
  .then(() => console.log("Seed complete."))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
