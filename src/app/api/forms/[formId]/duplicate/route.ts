import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-helpers";
import { nanoid } from "nanoid";

export async function POST(req: Request, { params }: { params: { formId: string } }) {
  const { error, session } = await requireAuth();
  if (error) return error;

  const form = await prisma.form.findFirst({
    where: { id: params.formId, userId: session!.user.id },
  });

  if (!form) {
    return NextResponse.json({ error: "Form not found" }, { status: 404 });
  }

  const newForm = await prisma.form.create({
    data: {
      userId: session!.user.id,
      slug: nanoid(10),
      title: `${form.title} (Copy)`,
      description: form.description,
      fields: form.fields,
      settings: form.settings,
      theme: form.theme,
      published: false,
    },
  });

  return NextResponse.json({
    form: {
      id: newForm.id,
      slug: newForm.slug,
      title: newForm.title,
    },
  }, { status: 201 });
}
