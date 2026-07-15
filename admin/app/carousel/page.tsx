"use client";

/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import { useEffect, useState } from "react";
import { AdminShell } from "@/components/admin-shell";
import { API_BASE_URL, deletePromotion, getAdminPromotions, Promotion } from "@/lib/api";

function formatDateTime(value?: string | null) {
  if (!value) return "—";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("es-MX", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export default function CarouselPage() {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;

    getAdminPromotions()
      .then((items) => {
        if (!alive) return;
        setPromotions(items ?? []);
      })
      .catch((err) => {
        if (!alive) return;
        setError(err instanceof Error ? err.message : "No se pudieron cargar las promociones.");
      })
      .finally(() => {
        if (alive) setLoading(false);
      });

    return () => {
      alive = false;
    };
  }, []);

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm("¿Eliminar esta promoción?");
    if (!confirmed) return;

    setDeletingId(id);
    setError(null);

    try {
      await deletePromotion(id);
      setPromotions((current) => current.filter((promotion) => promotion.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo eliminar la promoción.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <AdminShell>
      <div className="space-y-6">
        <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-zinc-500">Carousel</p>
              <h2 className="mt-2 text-2xl font-semibold text-zinc-950">Promociones</h2>
              <p className="mt-2 text-sm text-zinc-600">Listado, edición y alta de banners del carousel público.</p>
            </div>

            <Link
              href="/carousel/create"
              className="inline-flex items-center justify-center rounded-xl bg-zinc-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-600"
            >
              Crear nueva promoción
            </Link>
          </div>
        </section>

        {error ? <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div> : null}

        <section className="overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-zinc-200 text-sm">
              <thead className="bg-zinc-50 text-left text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
                <tr>
                  <th className="px-6 py-4">Banner</th>
                  <th className="px-6 py-4">Vigencia</th>
                  <th className="px-6 py-4">Orden</th>
                  <th className="px-6 py-4">Estado</th>
                  <th className="px-6 py-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200">
                {!loading && promotions.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-10 text-center text-zinc-500">
                      No hay promociones registradas.
                    </td>
                  </tr>
                ) : null}

                {promotions.map((promotion) => (
                  <tr key={promotion.id} className="hover:bg-zinc-50/80">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="flex h-20 w-32 items-center justify-center overflow-hidden rounded-xl border border-zinc-200 bg-zinc-50">
                          <img
                            src={`${API_BASE_URL}/rest/api/1/promotions/${encodeURIComponent(promotion.id)}/image`}
                            alt={promotion.title}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div>
                          <div className="font-medium text-zinc-950">{promotion.title}</div>
                          <div className="mt-1 text-xs text-zinc-500">ID: {promotion.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-zinc-600">
                      <div>{formatDateTime(promotion.startDate)}</div>
                      <div>{formatDateTime(promotion.endDate)}</div>
                    </td>
                    <td className="px-6 py-4 text-zinc-600">{promotion.displayOrder ?? 0}</td>
                    <td className="px-6 py-4">
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${promotion.active ? "bg-emerald-100 text-emerald-700" : "bg-zinc-100 text-zinc-600"}`}>
                        {promotion.active ? "Activa" : "Inactiva"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="inline-flex gap-3">
                        <Link
                          href={`/carousel/${encodeURIComponent(promotion.id)}`}
                          className="rounded-xl border border-zinc-300 px-4 py-2 text-xs font-semibold text-zinc-700 transition hover:border-zinc-950 hover:text-zinc-950"
                        >
                          Editar
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleDelete(promotion.id)}
                          disabled={deletingId === promotion.id}
                          className="rounded-xl border border-red-200 px-4 py-2 text-xs font-semibold text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {deletingId === promotion.id ? "Eliminando..." : "Eliminar"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {loading ? <div className="border-t border-zinc-200 px-6 py-6 text-sm text-zinc-500">Cargando promociones...</div> : null}
        </section>
      </div>
    </AdminShell>
  );
}
