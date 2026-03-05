import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-helpers";

export async function GET() {
  const { error, session } = await requireAuth();
  if (error) return error;

  const user = await prisma.user.findUnique({
    where: { id: session!.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      plan: true,
      createdAt: true,
      _count: { select: { forms: true } },
    },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json({
    user: {
      ...user,
      formCount: user._count.forms,
    },
  });
}

export async function PUT(req: Request) {
  const { error, session } = await requireAuth();
  if (error) return error;

  const body = await req.json();
  const data: Record<string, string> = {};

  if (body.name !== undefined) data.name = body.name;

  const user = await prisma.user.update({
    where: { id: session!.user.id },
    data,
    select: { id: true, name: true, email: true, plan: true },
  });

  return NextResponse.json({ user });
}
