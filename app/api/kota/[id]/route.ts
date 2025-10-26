// src/app/api/kota/[id]/route.ts

import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// PUT - Update kota
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json();

    const kota = await prisma.kota.update({
      where: { id: params.id },
      data: {
        namaKota: data.namaKota,
        latitude: parseFloat(data.latitude),
        longitude: parseFloat(data.longitude),
        provinsi: data.provinsi,
        pulau: data.pulau,
        luarNegeri: data.luarNegeri,
      },
    });

    return NextResponse.json(kota);
  } catch (error) {
    console.error("Error updating kota:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}

// DELETE - Hapus kota
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.kota.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: "Kota berhasil dihapus" });
  } catch (error) {
    console.error("Error deleting kota:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}