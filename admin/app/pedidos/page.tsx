"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { AdminShell } from "@/components/admin-shell";
import { AdminOrder, getAdminOrders } from "@/lib/api";

const statusLabels: Record<string, string> = {
  EN_PROCESO: "En proceso",
  ENVIADO: "Enviado",
  ENTREGADO: "Entregado",
  CANCELADO: "Cancelado",
};

const statusClasses: Record<string, string> = {
  EN_PROCESO: "bg-amber-100 text-amber-800",
  ENVIADO: "bg-sky-100 text-sky-800",
  ENTREGADO: "bg-emerald-100 text-emerald-800",
  CANCELADO: "bg-red-100 text-red-800",
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

function formatMoney(value?: number | null) {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
  }).format(Number(value ?? 0));
}

export default function PedidosPage() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    let active = true;
    getAdminOrders()
      .then((data) => {
        if (!active) return;
        setOrders(data);
      })
      .catch((err) => {
        if (!active) return;
        setError(err instanceof Error ? err.message : "No se pudieron cargar pedidos.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const filteredOrders = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return orders;
    return orders.filter((order) =>
      [order.userName, order.userEmail, order.guia, order.status]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(term)),
    );
  }, [orders, query]);

  return (
    <AdminShell>
      <div className="space-y-6">
        <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-zinc-500">Pedidos</p>
          <h2 className="mt-2 text-2xl font-semibold text-zinc-950">Administración de pedidos</h2>
          <p className="mt-2 text-sm text-zinc-600">Consulta y seguimiento operativo de pedidos.</p>
        </section>

        <div className="flex flex-col gap-3 rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Buscar por cliente, correo, guía o estado"
            className="w-full rounded-xl border border-zinc-300 px-4 py-3 text-sm outline-none transition focus:border-zinc-950 focus:ring-2 focus:ring-zinc-950/10 sm:max-w-md"
          />
          <p className="text-sm text-zinc-500">{loading ? "Cargando..." : `${filteredOrders.length} pedido(s)`}</p>
        </div>

        {error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
        ) : null}

        <section className="overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-zinc-200 text-sm">
              <thead className="bg-zinc-50 text-left text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
                <tr>
                  <th className="px-6 py-4">Pedido</th>
                  <th className="px-6 py-4">Fecha</th>
                  <th className="px-6 py-4">Cliente</th>
                  <th className="px-6 py-4">Guía</th>
                  <th className="px-6 py-4">Estado</th>
                  <th className="px-6 py-4">Total</th>
                  <th className="px-6 py-4 text-center">Items</th>
                  <th className="px-6 py-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200">
                {!loading && filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-10 text-center text-zinc-500">
                      No hay pedidos para mostrar.
                    </td>
                  </tr>
                ) : null}

                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-zinc-50/80">
                    <td className="px-6 py-4 font-medium text-zinc-950">#{order.id}</td>
                    <td className="px-6 py-4 text-zinc-600">{formatDate(order.createdAt)}</td>
                    <td className="px-6 py-4 text-zinc-600">
                      <div className="font-medium text-zinc-950">{order.userName ?? "Sin nombre"}</div>
                      <div>{order.userEmail ?? "—"}</div>
                    </td>
                    <td className="px-6 py-4 text-zinc-600">{order.guia ?? "—"}</td>
                    <td className="px-6 py-4">
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClasses[order.status ?? ""] ?? "bg-zinc-100 text-zinc-700"}`}>
                        {statusLabels[order.status ?? ""] ?? order.status ?? "Sin estado"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-zinc-600">{formatMoney(order.total)}</td>
                    <td className="px-6 py-4 text-center text-zinc-600">{order.itemsCount}</td>
                    <td className="px-6 py-4 text-right">
                      <Link href={`/pedidos/${order.id}`} className="rounded-xl bg-zinc-950 px-4 py-2 text-xs font-semibold text-white transition hover:bg-red-600">
                        Ver detalles
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </AdminShell>
  );
}
