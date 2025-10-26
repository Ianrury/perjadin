import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = request.headers.get("x-user-id");

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { action, rejectionReason } = await request.json();
    const perdinId = params.id;

    if (action === "APPROVE") {
      const perdin = await prisma.perdin.update({
        where: { id: perdinId },
        data: {
          status: "APPROVED",
          approvedById: userId,
          approvedAt: new Date(),
        },
      });

      return NextResponse.json(perdin);
    } else if (action === "REJECT") {
      const perdin = await prisma.perdin.update({
        where: { id: perdinId },
        data: {
          status: "REJECTED",
          approvedById: userId,
          approvedAt: new Date(),
          rejectionReason,
        },
      });

      return NextResponse.json(perdin);
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Error approving perdin:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}