"use client";

/* eslint-disable @next/next/no-img-element */

import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { AdminShell } from "@/components/admin-shell";
import {
  CotizacionDetail,
  CotizacionEstado,
  Product,
  getCotizacion,
  searchProducts,
  updateCotizacion,
} from "@/lib/api";

const statusLabels: Record<CotizacionEstado, string> = {
  BORRADOR: "Borrador",
  ENVIADA: "Enviada",
};

const statusClasses: Record<CotizacionEstado, string> = {
  BORRADOR: "bg-zinc-100 text-zinc-700",
  ENVIADA: "bg-emerald-100 text-emerald-800",
};

const SEARCH_PAGE_SIZE = 6;

type EditableItem = {
  productId: string;
  productName?: string | null;
  sku?: string | null;
  imageUrl?: string | null;
  quantity: number;
  unitPrice: number;
  subtotal: number;
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
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
  }).format(Number(value ?? 0));
}

function toEditableItems(quote: CotizacionDetail | null): EditableItem[] {
  if (!quote) return [];

  return quote.items.map((item) => ({
    productId: item.productId ?? "",
    productName: item.productName,
    sku: item.sku,
    imageUrl: item.imageUrl,
    quantity: item.quantity,
    unitPrice: item.unitPrice,
    subtotal: item.subtotal,
  }));
}

function buildPayload(items: EditableItem[]) {
  return items.reduce<Record<string, { cantidad: number }>>((acc, item) => {
    if (!item.productId) return acc;
    acc[item.productId] = { cantidad: item.quantity };
    return acc;
  }, {});
}

export default function CotizacionDetallePage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [quote, setQuote] = useState<CotizacionDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [items, setItems] = useState<EditableItem[]>([]);

  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [page, setPage] = useState(0);
  const [results, setResults] = useState<Product[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [searchError, setSearchError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    getCotizacion(params.id)
      .then((data) => {
        if (!active) return;
        setQuote(data);
        setNombre(data.nombre ?? "");
        setCorreo(data.correo ?? "");
        setItems(toEditableItems(data));
      })
      .catch((requestError) => {
        if (!active) return;
        setError(requestError instanceof Error ? requestError.message : "No se pudo cargar la cotización.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [params.id]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedQuery(query.trim());
      setPage(0);
    }, 250);

    return () => window.clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    let active = true;

    if (!debouncedQuery) {
      return () => {
        active = false;
      };
    }

    const load = async () => {
      try {
        setSearchError(null);
        const data = await searchProducts({ q: debouncedQuery, page, size: SEARCH_PAGE_SIZE });
        if (!active) return;
        setResults(data.content ?? []);
        setTotalPages(data.totalPages ?? 0);
        setTotalElements(data.totalElements ?? 0);
      } catch (requestError) {
        if (!active) return;
        setSearchError(requestError instanceof Error ? requestError.message : "No se pudieron cargar los productos.");
        setResults([]);
        setTotalPages(0);
        setTotalElements(0);
      }
    };

    load();

    return () => {
      active = false;
    };
  }, [debouncedQuery, page]);

  const editable = quote?.estado === "BORRADOR";

  const subtotal = useMemo(
    () => items.reduce((acc, item) => acc + Number(item.unitPrice ?? 0) * item.quantity, 0),
    [items],
  );

  const iva = useMemo(() => subtotal * 0.16, [subtotal]);
  const total = useMemo(() => subtotal + iva, [subtotal, iva]);

  const handleAddProduct = (product: Product) => {
    if (!editable) return;

    setItems((current) => {
      const existing = current.find((item) => item.productId === product.id);
      if (!existing) {
        return [
          ...current,
          {
            productId: product.id,
            productName: product.name,
            sku: product.sku,
            imageUrl: product.imageUrl,
            quantity: 1,
            unitPrice: Number(product.price ?? 0),
            subtotal: Number(product.price ?? 0),
          },
        ];
      }

      return current.map((item) =>
        item.productId === product.id
          ? { ...item, quantity: item.quantity + 1, subtotal: Number(item.unitPrice ?? 0) * (item.quantity + 1) }
          : item,
      );
    });
  };

  const handleQuantityChange = (productId: string, quantity: number) => {
    if (!editable || !Number.isFinite(quantity) || quantity < 1) return;

    setItems((current) =>
      current.map((item) =>
        item.productId === productId
          ? { ...item, quantity, subtotal: Number(item.unitPrice ?? 0) * quantity }
          : item,
      ),
    );
  };

  const handleRemove = (productId: string) => {
    if (!editable) return;
    setItems((current) => current.filter((item) => item.productId !== productId));
  };

  const saveQuote = async (estado: CotizacionEstado) => {
    if (!quote || !editable) return;

    setSaving(true);
    setError(null);
    setMessage(null);

    try {
      const updated = await updateCotizacion(quote.id, {
        nombre: nombre.trim(),
        correo: correo.trim(),
        productoSeleccionados: buildPayload(items),
        estado,
      });

      setQuote(updated);
      setNombre(updated.nombre ?? "");
      setCorreo(updated.correo ?? "");
      setItems(toEditableItems(updated));
      setMessage(estado === "ENVIADA" ? "Cotización enviada correctamente." : "Borrador guardado correctamente.");
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "No se pudo guardar la cotización.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminShell>
      <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-zinc-500">Cotizaciones</p>
            <h2 className="mt-2 text-2xl font-semibold text-zinc-950">Detalle de cotización #{quote?.id ?? params.id}</h2>
            <p className="mt-2 text-sm text-zinc-600">Consulta y edita borradores desde aquí.</p>
          </div>
          <button
            type="button"
            onClick={() => router.push("/cotizaciones")}
            className="rounded-xl border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100"
          >
            Volver a la lista
          </button>
        </div>

        {loading ? <div className="mt-6 text-sm text-zinc-500">Cargando cotización...</div> : null}
        {message ? <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{message}</div> : null}
        {error ? <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div> : null}

        {quote ? (
          <div className="mt-6 space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <label className="space-y-2 rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">Para quién</span>
                <input
                  disabled={!editable}
                  value={nombre}
                  onChange={(event) => setNombre(event.target.value)}
                  className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-zinc-950 focus:ring-2 focus:ring-zinc-950/10 disabled:bg-zinc-100"
                  placeholder="Nombre del cliente"
                />
                <input
                  disabled={!editable}
                  value={correo}
                  onChange={(event) => setCorreo(event.target.value)}
                  className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-zinc-950 focus:ring-2 focus:ring-zinc-950/10 disabled:bg-zinc-100"
                  placeholder="Correo del cliente"
                />
              </label>

              <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">Quién la creó</p>
                <div className="mt-3 space-y-2 text-sm text-zinc-700">
                  <p><span className="font-medium text-zinc-950">Nombre:</span> {quote.creadoPor?.name ?? "—"}</p>
                  <p><span className="font-medium text-zinc-950">Correo:</span> {quote.creadoPor?.email ?? "—"}</p>
                  <p><span className="font-medium text-zinc-950">Fecha:</span> {formatDate(quote.createdAt)}</p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClasses[quote.estado] ?? "bg-zinc-100 text-zinc-700"}`}>
                {statusLabels[quote.estado] ?? quote.estado}
              </span>
              <div className="rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-600">
                Items: <span className="font-semibold text-zinc-950">{items.length}</span>
              </div>
              <div className="rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-600">
                Total: <span className="font-semibold text-emerald-700">{money(total)}</span>
              </div>
              {editable ? (
                <div className="ml-auto flex flex-wrap gap-3">
                  <button
                    type="button"
                    disabled={saving}
                    onClick={() => saveQuote("BORRADOR")}
                    className="rounded-xl border border-zinc-300 px-4 py-2 text-sm font-semibold text-zinc-700 transition hover:border-zinc-950 hover:text-zinc-950 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {saving ? "Guardando..." : "Guardar borrador"}
                  </button>
                  <button
                    type="button"
                    disabled={saving}
                    onClick={() => saveQuote("ENVIADA")}
                    className="rounded-xl bg-zinc-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {saving ? "Enviando..." : "Enviar cotización"}
                  </button>
                </div>
              ) : null}
            </div>

            {editable ? (
              <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
                  <label className="w-full space-y-2 lg:max-w-2xl">
                    <span className="text-sm font-medium text-zinc-700">Buscar producto</span>
                    <input
                      value={query}
                      onChange={(event) => setQuery(event.target.value)}
                      placeholder="Buscar por nombre, SKU o descripción"
                      className="w-full rounded-xl border border-zinc-300 px-4 py-3 text-sm outline-none transition focus:border-zinc-950 focus:ring-2 focus:ring-zinc-950/10"
                    />
                  </label>

                  <div className="flex items-center gap-3 text-sm text-zinc-500">
                    <span>{`${totalElements} resultado(s)`}</span>
                  </div>
                </div>

                {debouncedQuery ? (
                  <div className="mt-5 rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
                    <div className="flex items-center justify-between gap-3 border-b border-zinc-200 pb-3">
                      <p className="text-sm font-semibold text-zinc-900">Productos encontrados</p>
                      <div className="flex items-center gap-2 text-sm">
                        <button
                          type="button"
                          disabled={page <= 0}
                          onClick={() => setPage((current) => Math.max(current - 1, 0))}
                          className="rounded-xl border border-zinc-300 px-3 py-2 font-semibold text-zinc-700 transition disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          Prev
                        </button>
                        <button
                          type="button"
                          disabled={page + 1 >= totalPages}
                          onClick={() => setPage((current) => current + 1)}
                          className="rounded-xl border border-zinc-300 px-3 py-2 font-semibold text-zinc-700 transition disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          Next
                        </button>
                      </div>
                    </div>

                    {searchError ? <p className="mt-3 text-sm text-red-700">{searchError}</p> : null}

                    <div className="mt-3 space-y-2">
                      {results.length === 0 ? (
                        <div className="rounded-2xl border border-dashed border-zinc-300 bg-white px-4 py-6 text-center text-sm text-zinc-500">
                          No se encontraron productos con ese criterio.
                        </div>
                      ) : null}

                      {results.map((product) => (
                        <button
                          key={product.id}
                          type="button"
                          onClick={() => handleAddProduct(product)}
                          className="flex w-full items-center gap-4 rounded-2xl border border-zinc-200 bg-white p-3 text-left transition hover:border-zinc-950 hover:shadow-sm"
                        >
                          <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-zinc-200 bg-zinc-50">
                            {product.imageUrl ? (
                              <img src={product.imageUrl} alt={product.name} className="h-full w-full object-contain p-1" />
                            ) : (
                              <span className="text-[10px] uppercase tracking-[0.2em] text-zinc-400">Sin imagen</span>
                            )}
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                              <div className="min-w-0">
                                <p className="truncate font-semibold text-zinc-950">{product.name}</p>
                                <p className="text-xs text-zinc-500">SKU: {product.sku ?? "—"}</p>
                              </div>
                              <p className="text-sm font-semibold text-zinc-950">{money(Number(product.price ?? 0))}</p>
                            </div>
                            <p className="mt-1 truncate text-xs text-zinc-500">{product.description ?? "Sin descripción"}</p>
                          </div>

                          <span className="rounded-full bg-zinc-950 px-3 py-1 text-xs font-semibold text-white">Agregar</span>
                        </button>
                      ))}
                    </div>

                    <div className="mt-4 flex items-center justify-between text-xs text-zinc-500">
                      <span>
                        Página {page + 1} de {Math.max(totalPages, 1)}
                      </span>
                      <span>Haz click en un producto para añadirlo a la cotización</span>
                    </div>
                  </div>
                ) : (
                  <div className="mt-5 rounded-2xl border border-dashed border-zinc-200 bg-zinc-50 px-4 py-6 text-sm text-zinc-500">
                    Escribe para buscar productos y agregarlos a la cotización.
                  </div>
                )}
              </section>
            ) : null}

            <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white">
              <div className="border-b border-zinc-200 px-4 py-3">
                <h3 className="text-sm font-semibold text-zinc-950">Productos cotizados</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-zinc-200 text-sm">
                  <thead className="bg-zinc-50 text-left text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
                    <tr>
                      <th className="px-4 py-3">Producto</th>
                      <th className="px-4 py-3 text-center">Cantidad</th>
                      <th className="px-4 py-3 text-right">Precio unitario</th>
                      <th className="px-4 py-3 text-right">Subtotal</th>
                      {editable ? <th className="px-4 py-3"></th> : null}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-200">
                    {items.length === 0 ? (
                      <tr>
                        <td colSpan={editable ? 5 : 4} className="px-4 py-8 text-center text-zinc-500">
                          No hay productos para mostrar.
                        </td>
                      </tr>
                    ) : null}

                    {items.map((item) => (
                      <tr key={item.productId} className="hover:bg-zinc-50/80">
                        <td className="px-4 py-3 text-zinc-700">
                          <div className="font-medium text-zinc-950">{item.productName ?? "Producto sin nombre"}</div>
                          <div className="text-xs text-zinc-500">{item.sku ?? "—"}</div>
                        </td>
                        <td className="px-4 py-3 text-center text-zinc-600">
                          {editable ? (
                            <input
                              type="number"
                              min={1}
                              value={item.quantity}
                              onChange={(event) => handleQuantityChange(item.productId, Number(event.target.value))}
                              className="w-24 rounded-xl border border-zinc-300 px-3 py-2 outline-none transition focus:border-zinc-950 focus:ring-2 focus:ring-zinc-950/10"
                            />
                          ) : (
                            item.quantity
                          )}
                        </td>
                        <td className="px-4 py-3 text-right text-zinc-600">{money(item.unitPrice)}</td>
                        <td className="px-4 py-3 text-right font-medium text-zinc-950">{money(item.subtotal)}</td>
                        {editable ? (
                          <td className="px-4 py-3 text-right">
                            <button
                              type="button"
                              onClick={() => handleRemove(item.productId)}
                              className="rounded-xl border border-red-200 px-3 py-2 text-xs font-semibold text-red-700 transition hover:bg-red-50"
                            >
                              Quitar
                            </button>
                          </td>
                        ) : null}
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
