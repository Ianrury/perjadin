
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id");

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const perdins = await prisma.perdin.findMany({
      where: { pegawaiId: userId },
      include: {
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

export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id");

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();

    const perdin = await prisma.perdin.create({
      data: {
        pegawaiId: userId,
        kotaAsalId: data.kotaAsalId,
        kotaTujuanId: data.kotaTujuanId,
        tanggalBerangkat: new Date(data.tanggalBerangkat),
        tanggalPulang: new Date(data.tanggalPulang),
        keterangan: data.keterangan,
        durasiHari: data.durasiHari,
        jarakKm: data.jarakKm,
        uangSakuPerHari: data.uangSakuPerHari,
        totalUangPerdin: data.totalUangPerdin,
        currencyCode: data.currency,
        status: "PENDING",
      },
      include: {
        kotaAsal: true,
        kotaTujuan: true,
      },
    });

    return NextResponse.json(perdin, { status: 201 });
  } catch (error) {
    console.error("Error creating perdin:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}