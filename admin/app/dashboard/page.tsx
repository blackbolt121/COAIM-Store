"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { FaBoxOpen, FaCartShopping, FaMoneyBillWave, FaUsers } from "react-icons/fa6";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { AdminShell } from "@/components/admin-shell";
import {
  AdminDashboardResponse,
  getAdminDashboard,
  getCurrentUser,
} from "@/lib/api";

const statusLabels: Record<string, string> = {
  EN_PROCESO: "En proceso",
  ENVIADO: "Enviado",
  ENTREGADO: "Entregado",
  CANCELADO: "Cancelado",
};

const statusClasses: Record<string, string> = {
  EN_PROCESO: "bg-yellow-100 text-yellow-800",
  ENVIADO: "bg-blue-100 text-blue-800",
  ENTREGADO: "bg-green-100 text-green-800",
  CANCELADO: "bg-red-100 text-red-800",
};

const pieColors = ["#4f46e5", "#0f766e", "#f59e0b", "#ef4444", "#8b5cf6", "#14b8a6", "#ec4899", "#64748b"];

type DashboardViewState = {
  userName?: string;
  dashboard?: AdminDashboardResponse;
  loading: boolean;
  error?: string;
};

function formatMoney(value: number) {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
  }).format(value ?? 0);
}

function formatMonthLabel(year: number, month: number) {
  const date = new Date(year, month - 1, 1);
  return new Intl.DateTimeFormat("es-MX", {
    month: "short",
    year: "2-digit",
  }).format(date);
}

function formatOrderDate(value?: string | null) {
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

export default function DashboardPage() {
  const [state, setState] = useState<DashboardViewState>({ loading: true });

  useEffect(() => {
    let active = true;

    const load = async () => {
      try {
        const [user, dashboard] = await Promise.all([
          getCurrentUser().catch(() => undefined),
          getAdminDashboard(),
        ]);

        if (!active) return;

        setState({
          loading: false,
          userName: user?.name,
          dashboard,
        });
      } catch (error) {
        if (!active) return;

        setState({
          loading: false,
          error: error instanceof Error ? error.message : "No se pudo cargar el dashboard.",
        });
      }
    };

    load();

    return () => {
      active = false;
    };
  }, []);

  const salesData = useMemo(
    () =>
      (state.dashboard?.salesData ?? []).map((entry) => ({
        label: formatMonthLabel(entry.year, entry.month),
        sales: entry.totalSales,
      })),
    [state.dashboard?.salesData],
  );

  const categoryData = state.dashboard?.categoryData ?? [];
  const latestOrders = state.dashboard?.ultimosPedidos ?? [];

  return (
    <AdminShell>
      <div className="space-y-6">
        <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-zinc-500">Dashboard</p>
          <h2 className="mt-2 text-2xl font-semibold text-zinc-950">
            {state.userName ? `Bienvenido, ${state.userName}` : "Dashboard de Administración"}
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-zinc-600">
            Vista operativa para seguimiento de catálogo, pedidos, cotizaciones y promociones.
          </p>
        </section>

        {state.error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {state.error}
          </div>
        ) : null}

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <Link
            href="/usuarios"
            className="flex items-center justify-between rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm transition hover:border-blue-400 hover:shadow-lg"
          >
            <div>
              <p className="text-sm font-medium uppercase text-zinc-500">Total de Usuarios</p>
              <p className="mt-2 text-3xl font-bold text-zinc-950">{state.loading ? "—" : state.dashboard?.totalUsuarios ?? 0}</p>
            </div>
            <div className="rounded-full bg-blue-100 p-3 text-blue-600">
              <FaUsers className="h-6 w-6" aria-hidden="true" />
            </div>
          </Link>

          <Link
            href="/productos"
            className="flex items-center justify-between rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm transition hover:border-green-400 hover:shadow-lg"
          >
            <div>
              <p className="text-sm font-medium uppercase text-zinc-500">Total de Productos</p>
              <p className="mt-2 text-3xl font-bold text-zinc-950">{state.loading ? "—" : state.dashboard?.totalProductos ?? 0}</p>
            </div>
            <div className="rounded-full bg-green-100 p-3 text-green-600">
              <FaBoxOpen className="h-6 w-6" aria-hidden="true" />
            </div>
          </Link>

          <section className="flex items-center justify-between rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
            <div>
              <p className="text-sm font-medium uppercase text-zinc-500">Ingresos del Mes</p>
              <p className="mt-2 text-3xl font-bold text-zinc-950">
                {state.loading ? "—" : formatMoney(state.dashboard?.ingresosMes ?? 0)}
              </p>
            </div>
            <div className="rounded-full bg-yellow-100 p-3 text-yellow-700">
              <FaMoneyBillWave className="h-6 w-6" aria-hidden="true" />
            </div>
          </section>

          <Link
            href="/pedidos"
            className="flex items-center justify-between rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm transition hover:border-purple-400 hover:shadow-lg"
          >
            <div>
              <p className="text-sm font-medium uppercase text-zinc-500">Pedidos Nuevos</p>
              <p className="mt-2 text-3xl font-bold text-zinc-950">{state.loading ? "—" : state.dashboard?.pedidosNuevos ?? 0}</p>
            </div>
            <div className="rounded-full bg-purple-100 p-3 text-purple-600">
              <FaCartShopping className="h-6 w-6" aria-hidden="true" />
            </div>
          </Link>
        </div>

        <div className="grid gap-6 lg:grid-cols-5">
          <section className="lg:col-span-3 rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-zinc-950">Ingresos por Mes</h3>
            <div className="mt-4 h-[320px]">
              {state.loading ? (
                <div className="flex h-full items-center justify-center text-sm text-zinc-500">Cargando gráfica...</div>
              ) : salesData.length === 0 ? (
                <div className="flex h-full items-center justify-center text-sm text-zinc-500">No hay datos para mostrar.</div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={salesData} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" />
                    <XAxis dataKey="label" tick={{ fill: "#71717a", fontSize: 12 }} axisLine={{ stroke: "#d4d4d8" }} tickLine={false} />
                    <YAxis
                      tick={{ fill: "#71717a", fontSize: 12 }}
                      axisLine={{ stroke: "#d4d4d8" }}
                      tickLine={false}
                      tickFormatter={(value) => `$${Math.round(Number(value) / 1000)}k`}
                    />
                    <Tooltip formatter={(value) => formatMoney(Number(value))} labelStyle={{ color: "#09090b" }} />
                    <Bar dataKey="sales" fill="#4f46e5" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </section>

          <section className="lg:col-span-2 rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-zinc-950">Productos por Marca</h3>
            <div className="mt-4 h-[320px]">
              {state.loading ? (
                <div className="flex h-full items-center justify-center text-sm text-zinc-500">Cargando gráfica...</div>
              ) : categoryData.length === 0 ? (
                <div className="flex h-full items-center justify-center text-sm text-zinc-500">No hay datos para mostrar.</div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      dataKey="count"
                      nameKey="category"
                      innerRadius={78}
                      outerRadius={116}
                      paddingAngle={2}
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`${entry.category}-${index}`} fill={pieColors[index % pieColors.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value, name, props) => [`${value} productos`, props.payload.category]} />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
            {categoryData.length > 0 ? (
              <div className="mt-4 flex flex-wrap gap-2">
                {categoryData.map((entry, index) => (
                  <span key={entry.category} className="inline-flex items-center gap-2 rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-700">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: pieColors[index % pieColors.length] }} />
                    {entry.category}
                  </span>
                ))}
              </div>
            ) : null}
          </section>
        </div>

        <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-zinc-950">Últimos Pedidos</h3>
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="text-left text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
                <tr>
                  <th className="p-2">ID Pedido</th>
                  <th className="p-2">Cliente</th>
                  <th className="p-2">Monto</th>
                  <th className="p-2">Estado</th>
                  <th className="p-2">Fecha</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {!state.loading && latestOrders.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-4 text-center text-zinc-500">No hay pedidos recientes.</td>
                  </tr>
                ) : null}
                {latestOrders.map((pedido) => (
                  <tr key={pedido.id}>
                    <td className="p-2 font-mono text-zinc-600">#{pedido.id}</td>
                    <td className="p-2 font-medium text-zinc-800">{pedido.userName ?? "—"}</td>
                    <td className="p-2 text-zinc-700">{formatMoney(pedido.total)}</td>
                    <td className="p-2">
                      <span className={`rounded-full px-2 py-1 text-xs font-semibold ${statusClasses[pedido.status ?? ""] ?? "bg-zinc-100 text-zinc-700"}`}>
                        {statusLabels[pedido.status ?? ""] ?? pedido.status ?? "Sin estado"}
                      </span>
                    </td>
                    <td className="p-2 text-zinc-600">{formatOrderDate(pedido.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4">
            <Link href="/pedidos" className="text-sm font-medium text-zinc-950 underline decoration-zinc-300 underline-offset-4 hover:text-red-600">
              Ver todos los pedidos
            </Link>
          </div>
        </section>
      </div>
    </AdminShell>
  );
}
