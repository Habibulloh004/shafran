import { NextResponse } from "next/server";

const backendUrl = process.env.BASE_URL || process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:8082";

// PUT - Bannerni yangilash (backendga FormData proxy)
export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const formData = await request.formData();

    const response = await fetch(`${backendUrl}/api/banner/${id}`, {
      method: "PUT",
      body: formData,
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      return NextResponse.json(
        { success: false, error: data.error || `HTTP ${response.status}` },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Banner update proxy error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
