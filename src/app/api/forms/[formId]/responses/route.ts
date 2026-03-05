import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-helpers";

interface Params {
  params: { formId: string };
}

// GET /api/forms/[formId]/responses — List responses (authenticated)
export async function GET(req: Request, { params }: Params) {
  const { error, session } = await requireAuth();
  if (error) return error;

  // Verify form belongs to user
  const form = await prisma.form.findFirst({
    where: { id: params.formId, userId: session!.user.id },
  });

  if (!form) {
    return NextResponse.json({ error: "Form not found" }, { status: 404 });
  }

  const url = new URL(req.url);
  const page = parseInt(url.searchParams.get("page") || "1");
  const limit = Math.min(parseInt(url.searchParams.get("limit") || "50"), 100);
  const skip = (page - 1) * limit;

  const [responses, total] = await Promise.all([
    prisma.response.findMany({
      where: { formId: params.formId },
      orderBy: { completedAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.response.count({ where: { formId: params.formId } }),
  ]);

  return NextResponse.json({
    responses: responses.map((r) => ({
      id: r.id,
      data: JSON.parse(r.data),
      metadata: JSON.parse(r.metadata),
      completedAt: r.completedAt.toISOString(),
    })),
    total,
    page,
    totalPages: Math.ceil(total / limit),
  });
}

// POST /api/forms/[formId]/responses — Submit a response (public, no auth)
export async function POST(req: Request, { params }: Params) {
  // Find form by ID or slug
  let form = await prisma.form.findUnique({ where: { id: params.formId } });
  if (!form) {
    form = await prisma.form.findUnique({ where: { slug: params.formId } });
  }

  if (!form || !form.published) {
    return NextResponse.json({ error: "Form not found or not published" }, { status: 404 });
  }

  // Check response limit for free plan
  const user = await prisma.user.findUnique({
    where: { id: form.userId },
    select: { plan: true },
  });

  if (user?.plan === "free") {
    const thisMonth = new Date();
    thisMonth.setDate(1);
    thisMonth.setHours(0, 0, 0, 0);
    const monthlyResponses = await prisma.response.count({
      where: {
        formId: form.id,
        completedAt: { gte: thisMonth },
      },
    });
    if (monthlyResponses >= 100) {
      return NextResponse.json(
        { error: "This form has reached its monthly response limit" },
        { status: 429 }
      );
    }
  }

  const body = await req.json();

  // Validate required fields
  const fields = JSON.parse(form.fields) as any[];
  const errors: Record<string, string> = {};

  for (const field of fields) {
    if (field.type === "heading" || field.type === "hidden") continue;
    const value = body.data?.[field.id];
    if (field.validation?.required) {
      if (!value || (typeof value === "string" && !value.trim())) {
        errors[field.id] = `${field.label} is required`;
      }
    }
    if (value && field.type === "email" && typeof value === "string") {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        errors[field.id] = "Invalid email address";
      }
    }
  }

  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ error: "Validation failed", errors }, { status: 400 });
  }

  // Extract metadata from request headers
  const headers = Object.fromEntries(req.headers);
  const metadata = {
    userAgent: headers["user-agent"] || "",
    referrer: headers["referer"] || "",
    ip: headers["x-forwarded-for"] || headers["x-real-ip"] || "",
  };

  const response = await prisma.response.create({
    data: {
      formId: form.id,
      data: JSON.stringify(body.data || {}),
      metadata: JSON.stringify(metadata),
    },
  });

  return NextResponse.json(
    { id: response.id, success: true },
    { status: 201 }
  );
}
