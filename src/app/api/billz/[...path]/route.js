/**
 * Billz API Proxy
 *
 * Barcha /api/billz/* so'rovlarni Billz API ga proxy qiladi
 * Avtomatik ravishda authentication qo'shadi
 */

import { NextResponse } from "next/server";

const BILLZ_API_URL = "https://api-admin.billz.ai";
const BILLZ_API_TOKEN = process.env.BILLZ_API_TOKEN;
const BILLZ_PLATFORM_ID = process.env.BILLZ_PLATFORM_ID || "1";

/**
 * Proxy request to Billz API
 */
async function proxyToBillz(request, path) {
  const url = `${BILLZ_API_URL}/${path}`;

  console.log(`\n[BILLZ PROXY] ${request.method} ${url}`);

  // Request body olish
  let body = null;
  if (request.method !== "GET" && request.method !== "HEAD") {
    try {
      body = await request.json();
      console.log("[BILLZ PROXY] Body:", JSON.stringify(body, null, 2));
    } catch {
      // Body yo'q yoki JSON emas
    }
  }

  // Billz API ga so'rov yuborish
  const response = await fetch(url, {
    method: request.method,
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${BILLZ_API_TOKEN}`,
      "platform-id": BILLZ_PLATFORM_ID,
      "Billz-Response-Channel": "HTTP",
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await response.json();

  console.log("[BILLZ PROXY] Status:", response.status);
  console.log("[BILLZ PROXY] Response:", JSON.stringify(data, null, 2));

  return NextResponse.json(data, { status: response.status });
}

// GET /api/billz/*
export async function GET(request, { params }) {
  const { path } = await params;
  const fullPath = path.join("/");
  return proxyToBillz(request, fullPath);
}

// POST /api/billz/*
export async function POST(request, { params }) {
  const { path } = await params;
  const fullPath = path.join("/");
  return proxyToBillz(request, fullPath);
}

// PUT /api/billz/*
export async function PUT(request, { params }) {
  const { path } = await params;
  const fullPath = path.join("/");
  return proxyToBillz(request, fullPath);
}

// DELETE /api/billz/*
export async function DELETE(request, { params }) {
  const { path } = await params;
  const fullPath = path.join("/");
  return proxyToBillz(request, fullPath);
}

// PATCH /api/billz/*
export async function PATCH(request, { params }) {
  const { path } = await params;
  const fullPath = path.join("/");
  return proxyToBillz(request, fullPath);
}
