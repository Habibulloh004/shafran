import { NextResponse } from "next/server";

// Bu yerda haqiqiy database bilan ishlash kerak
// Hozircha in-memory storage ishlatamiz (demo uchun)
let banners = [];

// GET - Barcha bannerlarni olish
export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      data: banners,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Bannerlarni olishda xatolik" },
      { status: 500 }
    );
  }
}

// POST - Yangi banner yaratish
export async function POST(request) {
  try {
    const body = await request.json();

    const newBanner = {
      id: Date.now().toString(),
      title: body.title || "",
      url: body.url || "",
      image_light: body.image_light || "",
      image_dark: body.image_dark || "",
      created_at: new Date().toISOString(),
    };

    banners.push(newBanner);

    return NextResponse.json({
      success: true,
      data: newBanner,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Banner yaratishda xatolik" },
      { status: 500 }
    );
  }
}
