import { NextResponse } from "next/server";

// In-memory storage (demo uchun - haqiqiy loyihada database ishlatiladi)
// Bu faqat demo uchun, server restart bo'lganda ma'lumotlar yo'qoladi
let banners = [];

// GET - Bitta bannerni olish
export async function GET(request, { params }) {
  try {
    const { id } = params;
    const banner = banners.find((b) => b.id === id);

    if (!banner) {
      return NextResponse.json(
        { success: false, error: "Banner topilmadi" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: banner,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Bannerni olishda xatolik" },
      { status: 500 }
    );
  }
}

// PUT - Bannerni yangilash
export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();

    const index = banners.findIndex((b) => b.id === id);

    if (index === -1) {
      return NextResponse.json(
        { success: false, error: "Banner topilmadi" },
        { status: 404 }
      );
    }

    banners[index] = {
      ...banners[index],
      title: body.title ?? banners[index].title,
      url: body.url ?? banners[index].url,
      image_light: body.image_light ?? banners[index].image_light,
      image_dark: body.image_dark ?? banners[index].image_dark,
      updated_at: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      data: banners[index],
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Bannerni yangilashda xatolik" },
      { status: 500 }
    );
  }
}

// DELETE - Bannerni o'chirish
export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    const index = banners.findIndex((b) => b.id === id);

    if (index === -1) {
      return NextResponse.json(
        { success: false, error: "Banner topilmadi" },
        { status: 404 }
      );
    }

    banners.splice(index, 1);

    return NextResponse.json({
      success: true,
      message: "Banner o'chirildi",
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Bannerni o'chirishda xatolik" },
      { status: 500 }
    );
  }
}
