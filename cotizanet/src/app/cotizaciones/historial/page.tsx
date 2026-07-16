"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AdminShell } from "@/app/components/admin-shell";
import { CotizacionEstado, CotizacionListItem, CotizacionPage, getCotizaciones, getCurrentUser } from "@/app/lib/api";

const statusLabels: Record<CotizacionEstado, string> = {
  BORRADOR: "Borrador",
  ENVIADA: "Enviada",
};

const statusClasses: Record<CotizacionEstado, string> = {
  BORRADOR: "bg-zinc-100 text-zinc-700",
  ENVIADA: "bg-emerald-100 text-emerald-800",
};

function formatDate(value?: string | null) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("es-MX", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function money(value?: number | null) {
  return new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(Number(value ?? 0));
}

function extractNames(items?: Array<string | { name?: string }>) {
  return (items ?? [])
    .map((item) => (typeof item === "string" ? item : item.name ?? ""))
    .filter(Boolean)
    .map((value) => value.trim());
}

function emptyState(): CotizacionPage {
  return {
    content: [],
    totalElements: 0,
    totalPages: 0,
    number: 0,
    size: 10,
    first: true,
    last: true,
    empty: true,
  };
}

export default function HistorialCotizacionesPage() {
  const [viewerRoles, setViewerRoles] = useState<string[]>([]);
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [estado, setEstado] = useState<"" | CotizacionEstado>("");
  const [destinatario, setDestinatario] = useState("");
  const [creador, setCreador] = useState("");
  const [page, setPage] = useState(0);
  const [data, setData] = useState<CotizacionPage>(emptyState());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const canSeeAllQuotes = viewerRoles.includes("ROLE_ADMIN");

  useEffect(() => {
    let active = true;

    getCurrentUser()
      .then((profile) => {
        if (!active) return;
        const roleNames = extractNames(profile.roles);
        const groupNames = extractNames(profile.groups);
        setViewerRoles([...roleNames, ...groupNames]);
      })
      .catch(() => {
        if (!active) return;
        setViewerRoles([]);
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedQuery(query.trim());
      setPage(0);
    }, 250);

    return () => window.clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    let active = true;

    const load = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await getCotizaciones({
          q: debouncedQuery || undefined,
          estado: estado || undefined,
          destinatario: destinatario.trim() || undefined,
          creador: canSeeAllQuotes ? creador.trim() || undefined : undefined,
          page,
          size: 10,
        });

        if (!active) return;
        setData(response);
      } catch (requestError) {
        if (!active) return;
        setError(requestError instanceof Error ? requestError.message : "No se pudo cargar el historial.");
        setData(emptyState());
      } finally {
        if (active) setLoading(false);
      }
    };

    load();

    return () => {
      active = false;
    };
  }, [debouncedQuery, estado, destinatario, creador, page, canSeeAllQuotes]);

  return (
    <AdminShell>
      <div className="space-y-6">
        <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-zinc-500">Historial</p>
              <h2 className="mt-2 text-2xl font-semibold text-zinc-950">Cotizaciones</h2>
              <p className="mt-2 max-w-2xl text-sm text-zinc-600">Consulta cotizaciones creadas, filtradas y paginadas.</p>
            </div>
            <Link href="/cotizaciones" className="rounded-xl border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100">Volver al cotizador</Link>
          </div>
        </section>

        <div className="grid gap-3 rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm lg:grid-cols-4">
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar por folio, cliente o vendedor" className="rounded-xl border border-zinc-300 px-4 py-3 text-sm outline-none transition focus:border-zinc-950 focus:ring-2 focus:ring-zinc-950/10" />
          <input value={destinatario} onChange={(event) => { setDestinatario(event.target.value); setPage(0); }} placeholder="Filtrar por destinatario" className="rounded-xl border border-zinc-300 px-4 py-3 text-sm outline-none transition focus:border-zinc-950 focus:ring-2 focus:ring-zinc-950/10" />
          <select value={estado} onChange={(event) => { setEstado((event.target.value || "") as "" | CotizacionEstado); setPage(0); }} className="rounded-xl border border-zinc-300 px-4 py-3 text-sm outline-none transition focus:border-zinc-950 focus:ring-2 focus:ring-zinc-950/10">
            <option value="">Todos los estados</option>
            <option value="BORRADOR">Borrador</option>
            <option value="ENVIADA">Enviada</option>
          </select>
          {canSeeAllQuotes ? (
            <input value={creador} onChange={(event) => { setCreador(event.target.value); setPage(0); }} placeholder="Filtrar por creador" className="rounded-xl border border-zinc-300 px-4 py-3 text-sm outline-none transition focus:border-zinc-950 focus:ring-2 focus:ring-zinc-950/10" />
          ) : (
            <div className="rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-500">Solo ves tus cotizaciones</div>
          )}
        </div>

        {error ? <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div> : null}

        <section className="overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-zinc-200 text-sm">
              <thead className="bg-zinc-50 text-left text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
                <tr>
                  <th className="px-6 py-4">Folio</th>
                  <th className="px-6 py-4">Fecha</th>
                  <th className="px-6 py-4">Para quién</th>
                  <th className="px-6 py-4">Creado por</th>
                  <th className="px-6 py-4">Estado</th>
                  <th className="px-6 py-4 text-center">Items</th>
                  <th className="px-6 py-4 text-right">Total</th>
                  <th className="px-6 py-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200">
                {!loading && data.content.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-10 text-center text-zinc-500">No hay cotizaciones para mostrar.</td>
                  </tr>
                ) : null}

                {data.content.map((quote: CotizacionListItem) => (
                  <tr key={quote.id} className="hover:bg-zinc-50/80">
                    <td className="px-6 py-4 font-medium text-zinc-950">{quote.id}</td>
                    <td className="px-6 py-4 text-zinc-600">{formatDate(quote.createdAt)}</td>
                    <td className="px-6 py-4 text-zinc-600">
                      <div className="font-medium text-zinc-950">{quote.nombre}</div>
                      <div className="text-xs text-zinc-500">{quote.correo}</div>
                    </td>
                    <td className="px-6 py-4 text-zinc-600">
                      <div className="font-medium text-zinc-950">{quote.creadoPor?.name ?? "—"}</div>
                      <div className="text-xs text-zinc-500">{quote.creadoPor?.email ?? "—"}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClasses[quote.estado] ?? "bg-zinc-100 text-zinc-700"}`}>
                        {statusLabels[quote.estado] ?? quote.estado}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center text-zinc-600">{quote.itemsCount}</td>
                    <td className="px-6 py-4 text-right font-medium text-zinc-950">{money(Number(quote.total ?? 0))}</td>
                    <td className="px-6 py-4 text-right">
                      <Link href={`/cotizaciones/${quote.id}`} className="rounded-xl bg-zinc-950 px-4 py-2 text-xs font-semibold text-white transition hover:bg-red-600">
                        {quote.estado === "BORRADOR" ? "Editar borrador" : "Ver"}
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-zinc-500">{loading ? "Cargando..." : `${data.totalElements} cotización(es)`}</p>
          <div className="flex items-center gap-2 text-sm">
            <button type="button" disabled={loading || page <= 0} onClick={() => setPage((current) => Math.max(current - 1, 0))} className="rounded-xl border border-zinc-300 px-3 py-2 font-semibold text-zinc-700 transition disabled:cursor-not-allowed disabled:opacity-50">Prev</button>
            <span className="px-2 text-zinc-500">{data.totalPages > 0 ? `${data.number + 1} / ${data.totalPages}` : "1 / 1"}</span>
            <button type="button" disabled={loading || page + 1 >= data.totalPages} onClick={() => setPage((current) => current + 1)} className="rounded-xl border border-zinc-300 px-3 py-2 font-semibold text-zinc-700 transition disabled:cursor-not-allowed disabled:opacity-50">Next</button>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
