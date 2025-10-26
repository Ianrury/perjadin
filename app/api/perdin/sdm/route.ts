
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const statusFilter = searchParams.get("status");

    let whereClause: any = {};

    if (statusFilter) {
      const statuses = statusFilter.split(",");
      whereClause.status = { in: statuses };
    }

    const perdins = await prisma.perdin.findMany({
      where: whereClause,
      include: {
        pegawai: { select: { nama: true } },
        kotaAsal: { select: { namaKota: true } },
        kotaTujuan: { select: { namaKota: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(perdins);
  } catch (error) {
    console.error("Error fetching perdins:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}
