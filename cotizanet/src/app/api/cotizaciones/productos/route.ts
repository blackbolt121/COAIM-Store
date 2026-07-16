import { NextResponse } from "next/server";
import { API_BASE_URL } from "@/app/lib/api";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const upstream = new URL(`${API_BASE_URL}/rest/api/1/producto/search`);

  searchParams.forEach((value, key) => {
    upstream.searchParams.set(key, value);
  });

  const backendResponse = await fetch(upstream.toString(), {
    headers: {
      Accept: "application/json",
    },
  });

  if (!backendResponse.ok) {
    const message = await backendResponse.text().catch(() => "");
    return NextResponse.json(
      { message: message || "No se pudieron cargar los productos." },
      { status: backendResponse.status },
    );
  }

  const data = await backendResponse.json();
  return NextResponse.json(data);
}
