import {
  BadRequestException,
  Injectable,
  NotFoundException,
  ServiceUnavailableException,
} from "@nestjs/common";
import type { Prisma } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";
import { CONTRACT_TEMPLATES } from "./contract-templates";

const ANAF_URL = "https://webservicesp.anaf.ro/api/PlatitorTvaRest/v9/tva";

export type AnafResult = {
  cui: string;
  name: string;
  address: string;
  regCom: string | null;
  caen: string | null;
  vatPayer: boolean;
  inactive: boolean;
  risk: string | null;
};

@Injectable()
export class ContractsService {
  constructor(private readonly prisma: PrismaService) {}

  templates() {
    return CONTRACT_TEMPLATES.map((t) => ({ key: t.key, label: t.label }));
  }

  /** Look up a company by CUI at ANAF (brief §5bis). Free, no key, 1 req/s. */
  async anafLookup(cuiRaw: string): Promise<AnafResult> {
    const cui = Number(String(cuiRaw).replace(/^RO/i, "").trim());
    if (!Number.isInteger(cui) || cui <= 0) {
      throw new BadRequestException("CUI invalid.");
    }

    type AnafResponse = {
      found?: Array<{
        date_generale: {
          cui: number;
          denumire: string;
          adresa: string;
          nrRegCom?: string;
          cod_CAEN?: string;
        };
        inregistrare_scop_Tva?: { scpTVA?: boolean };
        stare_inactiv?: { statusInactivi?: boolean };
      }>;
    };

    let json: AnafResponse;
    try {
      const today = new Date().toISOString().slice(0, 10);
      const res = await fetch(ANAF_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify([{ cui, data: today }]),
        signal: AbortSignal.timeout(12_000),
      });
      if (!res.ok) throw new Error(`ANAF ${res.status}`);
      // res.json() is `any`; the assertion makes the trust in ANAF's shape
      // explicit instead of letting `any` leak through the rest of the method.
      json = (await res.json()) as AnafResponse;
    } catch {
      // Manual-entry fallback stays available in the UI (brief §5bis).
      throw new ServiceUnavailableException(
        "ANAF indisponibil. Completează manual datele.",
      );
    }

    const f = json.found?.[0];
    if (!f) throw new NotFoundException("CUI negăsit la ANAF.");

    const g = f.date_generale;
    const inactive = f.stare_inactiv?.statusInactivi === true;
    const vatPayer = f.inregistrare_scop_Tva?.scpTVA === true;

    return {
      cui: String(g.cui),
      name: g.denumire,
      address: g.adresa,
      regCom: g.nrRegCom || null,
      caen: g.cod_CAEN || null,
      vatPayer,
      inactive,
      risk: inactive
        ? "⚠️ Firmă INACTIVĂ fiscal — semnal major de risc. Verifică înainte de a semna."
        : !vatPayer
          ? "Firmă neplătitoare de TVA."
          : null,
    };
  }

  /** CTR-YYYY-NNN, sequential within the year. */
  private async nextNumber(): Promise<string> {
    const year = new Date().getFullYear();
    const count = await this.prisma.contract.count({
      where: { number: { startsWith: `CTR-${year}-` } },
    });
    return `CTR-${year}-${String(count + 1).padStart(3, "0")}`;
  }

  list() {
    return this.prisma.contract.findMany({
      orderBy: { createdAt: "desc" },
      include: { project: { select: { clientName: true } } },
    });
  }

  async get(id: string) {
    const c = await this.prisma.contract.findUnique({
      where: { id },
      include: { annexes: { orderBy: { order: "asc" } } },
    });
    if (!c) throw new NotFoundException();
    return c;
  }

  async create(data: Omit<Prisma.ContractCreateInput, "number">) {
    const number = await this.nextNumber();
    return this.prisma.contract.create({ data: { ...data, number } });
  }

  async update(id: string, data: Prisma.ContractUpdateInput) {
    await this.get(id);
    return this.prisma.contract.update({ where: { id }, data });
  }

  async remove(id: string) {
    await this.get(id);
    return this.prisma.contract.delete({ where: { id } });
  }
}
