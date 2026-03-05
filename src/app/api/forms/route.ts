import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-helpers";
import { nanoid } from "nanoid";
import { DEFAULT_SETTINGS, DEFAULT_THEME } from "@/lib/types";

// GET /api/forms — List all forms for the current user
export async function GET() {
  const { error, session } = await requireAuth();
  if (error) return error;

  const forms = await prisma.form.findMany({
    where: { userId: session!.user.id },
    orderBy: { updatedAt: "desc" },
    include: { _count: { select: { responses: true } } },
  });

  const result = forms.map((f) => ({
    id: f.id,
    slug: f.slug,
    title: f.title,
    description: f.description,
    fields: JSON.parse(f.fields),
    settings: JSON.parse(f.settings),
    theme: JSON.parse(f.theme),
    published: f.published,
    views: f.views,
    responses: f._count.responses,
    createdAt: f.createdAt.toISOString(),
    updatedAt: f.updatedAt.toISOString(),
  }));

  return NextResponse.json({ forms: result });
}

// POST /api/forms — Create a new form
export async function POST() {
  const { error, session } = await requireAuth();
  if (error) return error;

  // Check form limit for free plan
  const userId = session!.user.id;
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { plan: true } });
  const formCount = await prisma.form.count({ where: { userId } });

  if (user?.plan === "free" && formCount >= 3) {
    return NextResponse.json(
      { error: "Free plan allows up to 3 forms. Upgrade to create more." },
      { status: 403 }
    );
  }

  const slug = nanoid(10);

  const form = await prisma.form.create({
    data: {
      userId,
      slug,
      title: "Untitled Form",
      fields: "[]",
      settings: JSON.stringify(DEFAULT_SETTINGS),
      theme: JSON.stringify(DEFAULT_THEME),
    },
  });

  return NextResponse.json({
    form: {
      id: form.id,
      slug: form.slug,
      title: form.title,
      fields: [],
      settings: DEFAULT_SETTINGS,
      theme: DEFAULT_THEME,
      published: false,
      views: 0,
      responses: 0,
      createdAt: form.createdAt.toISOString(),
      updatedAt: form.updatedAt.toISOString(),
    },
  }, { status: 201 });
}
