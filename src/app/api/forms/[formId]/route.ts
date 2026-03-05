import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-helpers";

interface Params {
  params: { formId: string };
}

// GET /api/forms/[formId] — Get a single form
export async function GET(req: Request, { params }: Params) {
  const url = new URL(req.url);
  const isPublic = url.searchParams.get("public") === "true";

  if (isPublic) {
    // Public access by slug — no auth needed
    const form = await prisma.form.findUnique({ where: { slug: params.formId } });
    if (!form || !form.published) {
      return NextResponse.json({ error: "Form not found" }, { status: 404 });
    }

    // Increment view count
    await prisma.form.update({
      where: { id: form.id },
      data: { views: { increment: 1 } },
    });

    return NextResponse.json({
      form: {
        id: form.id,
        slug: form.slug,
        title: form.title,
        description: form.description,
        fields: JSON.parse(form.fields),
        settings: JSON.parse(form.settings),
        theme: JSON.parse(form.theme),
        published: form.published,
      },
    });
  }

  // Authenticated access by ID
  const { error, session } = await requireAuth();
  if (error) return error;

  const form = await prisma.form.findFirst({
    where: { id: params.formId, userId: session!.user.id },
    include: { _count: { select: { responses: true } } },
  });

  if (!form) {
    return NextResponse.json({ error: "Form not found" }, { status: 404 });
  }

  return NextResponse.json({
    form: {
      id: form.id,
      slug: form.slug,
      title: form.title,
      description: form.description,
      fields: JSON.parse(form.fields),
      settings: JSON.parse(form.settings),
      theme: JSON.parse(form.theme),
      published: form.published,
      views: form.views,
      responses: form._count.responses,
      createdAt: form.createdAt.toISOString(),
      updatedAt: form.updatedAt.toISOString(),
    },
  });
}

// PUT /api/forms/[formId] — Update a form
export async function PUT(req: Request, { params }: Params) {
  const { error, session } = await requireAuth();
  if (error) return error;

  const existing = await prisma.form.findFirst({
    where: { id: params.formId, userId: session!.user.id },
  });

  if (!existing) {
    return NextResponse.json({ error: "Form not found" }, { status: 404 });
  }

  const body = await req.json();
  const data: Record<string, unknown> = {};

  if (body.title !== undefined) data.title = body.title;
  if (body.description !== undefined) data.description = body.description;
  if (body.fields !== undefined) data.fields = JSON.stringify(body.fields);
  if (body.settings !== undefined) data.settings = JSON.stringify(body.settings);
  if (body.theme !== undefined) data.theme = JSON.stringify(body.theme);

  const form = await prisma.form.update({
    where: { id: params.formId },
    data,
    include: { _count: { select: { responses: true } } },
  });

  return NextResponse.json({
    form: {
      id: form.id,
      slug: form.slug,
      title: form.title,
      description: form.description,
      fields: JSON.parse(form.fields),
      settings: JSON.parse(form.settings),
      theme: JSON.parse(form.theme),
      published: form.published,
      views: form.views,
      responses: form._count.responses,
      createdAt: form.createdAt.toISOString(),
      updatedAt: form.updatedAt.toISOString(),
    },
  });
}

// DELETE /api/forms/[formId] — Delete a form
export async function DELETE(req: Request, { params }: Params) {
  const { error, session } = await requireAuth();
  if (error) return error;

  const existing = await prisma.form.findFirst({
    where: { id: params.formId, userId: session!.user.id },
  });

  if (!existing) {
    return NextResponse.json({ error: "Form not found" }, { status: 404 });
  }

  await prisma.form.delete({ where: { id: params.formId } });

  return NextResponse.json({ success: true });
}
