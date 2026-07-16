import { NextResponse } from "next/server";
import { API_BASE_URL } from "@/app/lib/api";

type QuoteRequestBody = {
  nombre?: string;
  correo?: string;
  productoSeleccionados?: Record<string, { cantidad: number }>;
  estado?: "BORRADOR" | "ENVIADA";
};

export async function POST(request: Request) {
  const body = (await request.json()) as QuoteRequestBody;

  const nombre = body.nombre?.trim();
  const correo = body.correo?.trim();
  const productoSeleccionados = body.productoSeleccionados ?? {};

  if (!nombre || !correo || Object.keys(productoSeleccionados).length === 0) {
    return NextResponse.json(
      { message: "Faltan datos para enviar la cotización." },
      { status: 400 },
    );
  }

  const backendResponse = await fetch(`${API_BASE_URL}/rest/api/1/cotizaciones`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    credentials: "include",
    body: JSON.stringify({
      nombre,
      correo,
      productoSeleccionados,
      estado: body.estado ?? "ENVIADA",
    }),
  });

  if (!backendResponse.ok) {
    const message = await backendResponse.text().catch(() => "");
    return NextResponse.json(
      { message: message || "No se pudo enviar la cotización." },
      { status: backendResponse.status },
    );
  }

  return NextResponse.json({ ok: true });
}
