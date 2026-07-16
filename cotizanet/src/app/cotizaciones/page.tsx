"use client";

/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { AdminShell } from "@/app/components/admin-shell";
import {
  AdminUser,
  CotizacionEstado,
  Product,
  ProductSearchResponse,
  createCotizacion,
  getAdminUsers,
} from "@/app/lib/api";

type SelectedQuoteItem = Product & { quantity: number };

const SEARCH_PAGE_SIZE = 6;

function money(amount: number) {
  return amount.toLocaleString("es-MX", { style: "currency", currency: "MXN" });
}

function buildSelectionPayload(items: SelectedQuoteItem[]) {
  return items.reduce<Record<string, { cantidad: number }>>((acc, item) => {
    acc[item.id] = { cantidad: item.quantity };
    return acc;
  }, {});
}

export default function CotizacionesPage() {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [page, setPage] = useState(0);
  const [results, setResults] = useState<Product[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const [clients, setClients] = useState<AdminUser[]>([]);
  const [clientSearch, setClientSearch] = useState("");
  const [clientDropdownOpen, setClientDropdownOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<AdminUser | null>(null);
  const [manualClient, setManualClient] = useState(false);
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [selectedItems, setSelectedItems] = useState<SelectedQuoteItem[]>([]);
  const [savingQuote, setSavingQuote] = useState(false);
  const [composerMessage, setComposerMessage] = useState<string | null>(null);
  const [composerError, setComposerError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    getAdminUsers()
      .then((response) => {
        if (!active) return;
        setClients(response ?? []);
      })
      .catch(() => {
        if (!active) return;
        setClients([]);
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

    if (!debouncedQuery) {
      return () => {
        active = false;
      };
    }

    const load = async () => {
      try {
        setError(null);
        setResults([]);
        setTotalPages(0);
        setTotalElements(0);

        const params = new URLSearchParams({
          q: debouncedQuery,
          page: String(page),
          size: String(SEARCH_PAGE_SIZE),
        });

        const response = await fetch(`/api/cotizaciones/productos?${params.toString()}`);

        if (!response.ok) {
          const message = await response.text().catch(() => "");
          throw new Error(message || "No se pudieron cargar los productos.");
        }

        const data = (await response.json()) as ProductSearchResponse;

        if (!active) return;
        setResults(data.content ?? []);
        setTotalPages(data.totalPages ?? 0);
        setTotalElements(data.totalElements ?? 0);
      } catch (requestError) {
        if (!active) return;
        setError(requestError instanceof Error ? requestError.message : "No se pudieron cargar los productos.");
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

  const subtotal = useMemo(
    () => selectedItems.reduce((acc, item) => acc + Number(item.price ?? 0) * item.quantity, 0),
    [selectedItems],
  );

  const iva = useMemo(() => subtotal * 0.16, [subtotal]);
  const total = useMemo(() => subtotal + iva, [subtotal, iva]);

  const filteredClients = useMemo(() => {
    const term = clientSearch.trim().toLowerCase();
    if (!term) return clients.slice(0, 8);

    return clients
      .filter((client) => {
        return (
          client.name?.toLowerCase().includes(term) ||
          client.email?.toLowerCase().includes(term) ||
          client.id?.toLowerCase().includes(term)
        );
      })
      .slice(0, 8);
  }, [clientSearch, clients]);

  const visibleResults = debouncedQuery ? results : [];
  const visibleTotalPages = debouncedQuery ? totalPages : 0;
  const visibleTotalElements = debouncedQuery ? totalElements : 0;
  const visibleError = debouncedQuery ? error : null;

  const clearSearch = () => {
    setQuery("");
    setDebouncedQuery("");
    setPage(0);
    setResults([]);
    setTotalPages(0);
    setTotalElements(0);
    setError(null);
  };

  const resetComposer = () => {
    setNombre("");
    setCorreo("");
    setSelectedItems([]);
    setSelectedClient(null);
    setClientSearch("");
    setManualClient(false);
    setClientDropdownOpen(false);
  };

  const selectClient = (client: AdminUser) => {
    setSelectedClient(client);
    setManualClient(false);
    setNombre(client.name ?? "");
    setCorreo(client.email ?? "");
    setClientSearch(`${client.name ?? ""} ${client.email ?? ""}`.trim());
    setClientDropdownOpen(false);
  };

  const toggleManualClient = (enabled: boolean) => {
    setManualClient(enabled);
    setComposerError(null);

    if (enabled) {
      setSelectedClient(null);
      setClientSearch("");
      setClientDropdownOpen(false);
      setNombre("");
      setCorreo("");
      return;
    }

    if (selectedClient) {
      setNombre(selectedClient.name ?? "");
      setCorreo(selectedClient.email ?? "");
    }
  };

  const handleClientSearchChange = (value: string) => {
    setClientSearch(value);
    setClientDropdownOpen(true);
    setSelectedClient(null);
    setNombre("");
    setCorreo("");
  };

  const handleSelectProduct = (product: Product) => {
    setSelectedItems((current) => {
      const existing = current.find((item) => item.id === product.id);
      if (!existing) {
        return [...current, { ...product, quantity: 1 }];
      }

      return current.map((item) =>
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item,
      );
    });

    clearSearch();
  };

  const handleQuantityChange = (id: string, quantity: number) => {
    if (!Number.isFinite(quantity) || quantity < 1) return;

    setSelectedItems((current) =>
      current.map((item) => (item.id === id ? { ...item, quantity } : item)),
    );
  };

  const handleRemove = (id: string) => {
    setSelectedItems((current) => current.filter((item) => item.id !== id));
  };

  const submitQuote = async (estado: CotizacionEstado) => {
    setComposerMessage(null);
    setComposerError(null);

    if (!nombre.trim() || !correo.trim()) {
      setComposerError("Captura nombre y correo del cliente.");
      return;
    }

    if (estado === "ENVIADA" && selectedItems.length === 0) {
      setComposerError("Agrega al menos un producto para enviar la cotización.");
      return;
    }

    setSavingQuote(true);

    try {
      await createCotizacion({
        nombre: nombre.trim(),
        correo: correo.trim(),
        productoSeleccionados: buildSelectionPayload(selectedItems),
        estado,
      });

      setComposerMessage(estado === "ENVIADA" ? "Cotización enviada correctamente." : "Borrador guardado correctamente.");
      resetComposer();
    } catch (requestError) {
      setComposerError(requestError instanceof Error ? requestError.message : "No se pudo guardar la cotización.");
    } finally {
      setSavingQuote(false);
    }
  };

  const showResults = debouncedQuery.length > 0;

  return (
    <AdminShell>
      <div className="space-y-8">
        <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-zinc-500">Cotizaciones</p>
              <h2 className="mt-2 text-2xl font-semibold text-zinc-950">Cotizador de productos</h2>
              <p className="mt-2 max-w-2xl text-sm text-zinc-600">
                Busca productos, agrégalos a la tabla y guarda un borrador o envía la cotización.
              </p>
            </div>
            <Link href="/cotizaciones/historial" className="rounded-xl border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100">
              Ver historial
            </Link>
          </div>
        </section>

        {composerMessage ? (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            {composerMessage}
          </div>
        ) : null}
        {composerError ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {composerError}
          </div>
        ) : null}

        <section className="grid gap-6 xl:grid-cols-[1fr_360px]">
          <div className="space-y-6">
            <div className="grid gap-4 rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm lg:grid-cols-2">
              {manualClient ? (
                <>
                  <label className="space-y-2">
                    <span className="text-sm font-medium text-zinc-700">Nombre del cliente</span>
                    <input value={nombre} onChange={(event) => setNombre(event.target.value)} placeholder="Nombre completo" className="w-full rounded-xl border border-zinc-300 px-4 py-3 text-sm outline-none transition focus:border-zinc-950 focus:ring-2 focus:ring-zinc-950/10" />
                  </label>
                  <label className="space-y-2">
                    <span className="text-sm font-medium text-zinc-700">Correo electrónico</span>
                    <input value={correo} onChange={(event) => setCorreo(event.target.value)} type="email" placeholder="cliente@ejemplo.com" className="w-full rounded-xl border border-zinc-300 px-4 py-3 text-sm outline-none transition focus:border-zinc-950 focus:ring-2 focus:ring-zinc-950/10" />
                  </label>
                </>
              ) : (
                <div className="relative lg:col-span-2" onBlurCapture={(event) => {
                  const nextTarget = event.relatedTarget;
                  if (!nextTarget || !event.currentTarget.contains(nextTarget as Node)) {
                    setClientDropdownOpen(false);
                  }
                }}>
                  <div className="space-y-2">
                    <span className="text-sm font-medium text-zinc-700">Seleccionar cliente</span>
                    <input value={clientSearch} onFocus={() => setClientDropdownOpen(true)} onChange={(event) => handleClientSearchChange(event.target.value)} placeholder="Buscar por nombre, correo o ID" className="w-full rounded-xl border border-zinc-300 px-4 py-3 text-sm outline-none transition focus:border-zinc-950 focus:ring-2 focus:ring-zinc-950/10" />
                  </div>
                  {clientDropdownOpen ? (
                    <div className="absolute z-20 mt-2 max-h-72 w-full overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-lg">
                      <div className="border-b border-zinc-200 px-4 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">Clientes encontrados</div>
                      <div className="max-h-64 overflow-y-auto">
                        {filteredClients.length === 0 ? (
                          <div className="px-4 py-6 text-sm text-zinc-500">No hay clientes que coincidan.</div>
                        ) : (
                          filteredClients.map((client) => (
                            <button key={client.id} type="button" onClick={() => selectClient(client)} className="block w-full border-b border-zinc-100 px-4 py-3 text-left transition hover:bg-zinc-50 last:border-b-0">
                              <div className="font-medium text-zinc-950">{client.name}</div>
                              <div className="text-xs text-zinc-500">{client.email}</div>
                            </button>
                          ))
                        )}
                      </div>
                    </div>
                  ) : null}
                  {selectedClient ? (
                    <div className="mt-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                      Cliente seleccionado: <span className="font-semibold">{selectedClient.name}</span> ({selectedClient.email})
                    </div>
                  ) : null}
                </div>
              )}

              <label className="flex items-center gap-3 rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 lg:col-span-2">
                <input type="checkbox" checked={manualClient} onChange={(event) => toggleManualClient(event.target.checked)} className="h-4 w-4 rounded border-zinc-300 text-zinc-950 focus:ring-zinc-950" />
                <span className="text-sm text-zinc-700">No encuentras el usuario? Proporciona los datos manualmente</span>
              </label>
            </div>

            <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
                <label className="w-full space-y-2 lg:max-w-2xl">
                  <span className="text-sm font-medium text-zinc-700">Buscar producto</span>
                  <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar por nombre, SKU o descripción" className="w-full rounded-xl border border-zinc-300 px-4 py-3 text-sm outline-none transition focus:border-zinc-950 focus:ring-2 focus:ring-zinc-950/10" />
                </label>

                <div className="flex items-center gap-3 text-sm text-zinc-500">
                  <span>{`${visibleTotalElements} resultado(s)`}</span>
                  <button type="button" onClick={clearSearch} className="rounded-xl border border-zinc-300 px-4 py-3 font-semibold text-zinc-700 transition hover:border-zinc-950 hover:text-zinc-950">Limpiar búsqueda</button>
                </div>
              </div>

              {showResults ? (
                <div className="mt-5 rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
                  <div className="flex items-center justify-between gap-3 border-b border-zinc-200 pb-3">
                    <p className="text-sm font-semibold text-zinc-900">Productos encontrados</p>
                    <div className="flex items-center gap-2 text-sm">
                      <button type="button" disabled={page <= 0} onClick={() => setPage((current) => Math.max(current - 1, 0))} className="rounded-xl border border-zinc-300 px-3 py-2 font-semibold text-zinc-700 transition disabled:cursor-not-allowed disabled:opacity-50">Prev</button>
                      <button type="button" disabled={page + 1 >= visibleTotalPages} onClick={() => setPage((current) => current + 1)} className="rounded-xl border border-zinc-300 px-3 py-2 font-semibold text-zinc-700 transition disabled:cursor-not-allowed disabled:opacity-50">Next</button>
                    </div>
                  </div>

                  {visibleError ? <p className="mt-3 text-sm text-red-700">{visibleError}</p> : null}

                  <div className="mt-3 space-y-2">
                    {visibleResults.length === 0 ? (
                      <div className="rounded-2xl border border-dashed border-zinc-300 bg-white px-4 py-6 text-center text-sm text-zinc-500">
                        No se encontraron productos con ese criterio.
                      </div>
                    ) : null}

                    {visibleResults.map((product) => (
                      <button key={product.id} type="button" onClick={() => handleSelectProduct(product)} className="flex w-full items-center gap-4 rounded-2xl border border-zinc-200 bg-white p-3 text-left transition hover:border-zinc-950 hover:shadow-sm">
                        <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-zinc-200 bg-zinc-50">
                          {product.imageUrl ? <img src={product.imageUrl} alt={product.name} className="h-full w-full object-contain p-1" /> : <span className="text-[10px] uppercase tracking-[0.2em] text-zinc-400">Sin imagen</span>}
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
                    <span>Página {page + 1} de {Math.max(visibleTotalPages, 1)}</span>
                    <span>Haz click en un producto para añadirlo a la cotización</span>
                  </div>
                </div>
              ) : (
                <div className="mt-5 rounded-2xl border border-dashed border-zinc-200 bg-zinc-50 px-4 py-6 text-sm text-zinc-500">
                  Escribe para buscar productos y agregarlos a la cotización.
                </div>
              )}
            </div>

            <section className="overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm">
              <div className="border-b border-zinc-200 px-6 py-4">
                <h3 className="text-lg font-semibold text-zinc-950">Productos cotizados</h3>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-zinc-200 text-sm">
                  <thead className="bg-zinc-50 text-left text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
                    <tr>
                      <th className="px-6 py-4">Producto</th>
                      <th className="px-6 py-4">Precio</th>
                      <th className="px-6 py-4">Cantidad</th>
                      <th className="px-6 py-4">Total</th>
                      <th className="px-6 py-4"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-200">
                    {selectedItems.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-10 text-center text-zinc-500">Aún no has agregado productos a la cotización.</td>
                      </tr>
                    ) : null}

                    {selectedItems.map((item) => {
                      const lineTotal = Number(item.price ?? 0) * item.quantity;
                      return (
                        <tr key={item.id} className="hover:bg-zinc-50/80">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-zinc-200 bg-zinc-50">
                                {item.imageUrl ? <img src={item.imageUrl} alt={item.name} className="h-full w-full object-contain p-1" /> : <span className="text-[10px] uppercase tracking-[0.2em] text-zinc-400">Sin imagen</span>}
                              </div>
                              <div>
                                <div className="font-medium text-zinc-950">{item.name}</div>
                                <div className="text-xs text-zinc-500">SKU: {item.sku ?? "—"}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-zinc-600">{money(Number(item.price ?? 0))}</td>
                          <td className="px-6 py-4">
                            <input type="number" min={1} value={item.quantity} onChange={(event) => handleQuantityChange(item.id, Number(event.target.value))} className="w-24 rounded-xl border border-zinc-300 px-3 py-2 outline-none transition focus:border-zinc-950 focus:ring-2 focus:ring-zinc-950/10" />
                          </td>
                          <td className="px-6 py-4 font-medium text-zinc-950">{money(lineTotal)}</td>
                          <td className="px-6 py-4 text-right">
                            <button type="button" onClick={() => handleRemove(item.id)} className="rounded-xl border border-red-200 px-3 py-2 text-xs font-semibold text-red-700 transition hover:bg-red-50">Quitar</button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </section>
          </div>

          <aside className="space-y-6">
            <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-zinc-950">Resumen</h3>
              <div className="mt-4 space-y-3 text-sm text-zinc-600">
                <div className="flex items-center justify-between"><span>Subtotal</span><span className="font-medium text-zinc-950">{money(subtotal)}</span></div>
                <div className="flex items-center justify-between"><span>IVA (16%)</span><span className="font-medium text-zinc-950">{money(iva)}</span></div>
                <div className="flex items-center justify-between border-t border-zinc-200 pt-3 text-base"><span className="font-semibold text-zinc-950">Total</span><span className="font-semibold text-emerald-700">{money(total)}</span></div>
              </div>

              <div className="mt-6 grid gap-3">
                <button type="button" disabled={savingQuote} onClick={() => submitQuote("BORRADOR")} className="w-full rounded-2xl border border-zinc-300 px-4 py-3 text-sm font-semibold text-zinc-800 transition hover:border-zinc-950 hover:text-zinc-950 disabled:cursor-not-allowed disabled:opacity-60">{savingQuote ? "Guardando..." : "Guardar borrador"}</button>
                <button type="button" disabled={savingQuote} onClick={() => submitQuote("ENVIADA")} className="w-full rounded-2xl bg-zinc-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60">{savingQuote ? "Enviando..." : "Enviar cotización"}</button>
              </div>
            </div>
          </aside>
        </section>
      </div>
    </AdminShell>
  );
}
