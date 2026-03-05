import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-helpers";

export async function POST(req: Request, { params }: { params: { formId: string } }) {
  const { error, session } = await requireAuth();
  if (error) return error;

  const form = await prisma.form.findFirst({
    where: { id: params.formId, userId: session!.user.id },
  });

  if (!form) {
    return NextResponse.json({ error: "Form not found" }, { status: 404 });
  }

  const updated = await prisma.form.update({
    where: { id: params.formId },
    data: { published: !form.published },
  });

  return NextResponse.json({
    form: {
      id: updated.id,
      published: updated.published,
      slug: updated.slug,
    },
  });
}
