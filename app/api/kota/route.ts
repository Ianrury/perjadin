// src/app/api/kota/route.ts

import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET - Ambil semua kota
export async function GET() {
  try {
    const kotas = await prisma.kota.findMany({
      orderBy: { namaKota: "asc" },
    });

    return NextResponse.json(kotas);
  } catch (error) {
    console.error("Error fetching kotas:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}

// POST - Tambah kota baru
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    const kota = await prisma.kota.create({
      data: {
        namaKota: data.namaKota,
        latitude: parseFloat(data.latitude),
        longitude: parseFloat(data.longitude),
        provinsi: data.provinsi,
        pulau: data.pulau,
        luarNegeri: data.luarNegeri || false,
      },
    });

    return NextResponse.json(kota, { status: 201 });
  } catch (error) {
    console.error("Error creating kota:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}
