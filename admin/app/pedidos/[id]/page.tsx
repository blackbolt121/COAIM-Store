"use client";

import { useParams, useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { AdminShell } from "@/components/admin-shell";
import { AdminOrder, getAdminOrder, updateAdminOrder } from "@/lib/api";

const statuses = ["EN_PROCESO", "ENVIADO", "ENTREGADO", "CANCELADO"] as const;

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

export default function PedidoDetallePage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [order, setOrder] = useState<AdminOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    getAdminOrder(Number(params.id))
      .then((data) => {
        if (!active) return;
        setOrder(data);
      })
      .catch((err) => {
        if (!active) return;
        setError(err instanceof Error ? err.message : "No se pudo cargar el pedido.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [params.id]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!order) return;

    setSaving(true);
    setError(null);

    const formData = new FormData(event.currentTarget);

    try {
      const updated = await updateAdminOrder(Number(params.id), {
        guia: String(formData.get("guia") ?? ""),
        pedidoStatus: String(formData.get("pedidoStatus") ?? "EN_PROCESO"),
      });
      setOrder(updated);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo guardar el pedido.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminShell>
      <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-zinc-500">Pedidos</p>
            <h2 className="mt-2 text-2xl font-semibold text-zinc-950">Detalle de pedido #{order?.id ?? ""}</h2>
          </div>
          <button type="button" onClick={() => router.push("/pedidos")} className="rounded-xl border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100">
            Volver a la lista
          </button>
        </div>
        <p className="mt-2 text-sm text-zinc-600">Actualiza guía y estado operativo del pedido.</p>

        {loading ? <div className="mt-6 text-sm text-zinc-500">Cargando pedido...</div> : null}
        {error ? <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div> : null}

        {order ? (
          <div className="mt-6 space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">Información del cliente</p>
                <div className="mt-3 space-y-2 text-sm text-zinc-700">
                  <p><span className="font-medium text-zinc-950">Cliente:</span> {order.userName ?? "Sin nombre"}</p>
                  <p><span className="font-medium text-zinc-950">Correo:</span> {order.userEmail ?? "—"}</p>
                </div>
              </div>

              <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">Información del pedido</p>
                <div className="mt-3 space-y-2 text-sm text-zinc-700">
                  <p><span className="font-medium text-zinc-950">Fecha:</span> {formatDate(order.createdAt)}</p>
                  <p><span className="font-medium text-zinc-950">Actualizado:</span> {formatDate(order.updatedAt)}</p>
                  <p><span className="font-medium text-zinc-950">Total:</span> {formatMoney(order.total)}</p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="grid gap-4 rounded-2xl border border-zinc-200 bg-white p-4 md:grid-cols-2">
              <label className="space-y-2">
                <span className="text-sm font-medium text-zinc-700">Guía</span>
                <input name="guia" defaultValue={order.guia ?? ""} className="w-full rounded-xl border border-zinc-300 px-4 py-3 outline-none transition focus:border-zinc-950 focus:ring-2 focus:ring-zinc-950/10" />
              </label>
              <label className="space-y-2">
                <span className="text-sm font-medium text-zinc-700">Estado</span>
                <select name="pedidoStatus" defaultValue={order.status ?? "EN_PROCESO"} className="w-full rounded-xl border border-zinc-300 px-4 py-3 outline-none transition focus:border-zinc-950 focus:ring-2 focus:ring-zinc-950/10">
                  {statuses.map((status) => (
                    <option key={status} value={status}>
                      {statusLabels[status]}
                    </option>
                  ))}
                </select>
              </label>

              <div className="md:col-span-2 flex flex-wrap items-center gap-3">
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClasses[order.status ?? ""] ?? "bg-zinc-100 text-zinc-700"}`}>
                  {statusLabels[order.status ?? ""] ?? order.status ?? "Sin estado"}
                </span>
                <div className="rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-600">
                  Productos: <span className="font-semibold text-zinc-950">{order.itemsCount}</span>
                </div>
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-xl bg-zinc-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving ? "Guardando..." : "Guardar cambios"}
                </button>
              </div>
            </form>

            <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white">
              <div className="border-b border-zinc-200 px-4 py-3">
                <h3 className="text-sm font-semibold text-zinc-950">Productos en el pedido</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-zinc-200 text-sm">
                  <thead className="bg-zinc-50 text-left text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
                    <tr>
                      <th className="px-4 py-3">Producto</th>
                      <th className="px-4 py-3 text-center">Cantidad</th>
                      <th className="px-4 py-3 text-right">Precio unitario</th>
                      <th className="px-4 py-3 text-right">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-200">
                    {(order.items ?? []).length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-4 py-8 text-center text-zinc-500">
                          No hay productos para mostrar.
                        </td>
                      </tr>
                    ) : null}

                    {(order.items ?? []).map((item) => (
                      <tr key={`${item.productId ?? item.productName}-${item.productName}`} className="hover:bg-zinc-50/80">
                        <td className="px-4 py-3 text-zinc-700">
                          <div className="font-medium text-zinc-950">{item.productName ?? "Producto sin nombre"}</div>
                          <div className="text-xs text-zinc-500">{item.productId ?? "—"}</div>
                        </td>
                        <td className="px-4 py-3 text-center text-zinc-600">{item.quantity}</td>
                        <td className="px-4 py-3 text-right text-zinc-600">{formatMoney(item.unitPrice)}</td>
                        <td className="px-4 py-3 text-right font-medium text-zinc-950">{formatMoney(item.subtotal)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : null}
      </section>
    </AdminShell>
  );
}
