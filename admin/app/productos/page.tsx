"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { AdminShell } from "@/components/admin-shell";
import { Product, Vendor, getAllProducts, getProductCategories, getVendors, searchProducts } from "@/lib/api";

export default function ProductosPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [brand, setBrand] = useState("");
  const [categories, setCategories] = useState<string[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [page, setPage] = useState(0);
  const [size] = useState(12);
  const [results, setResults] = useState<Product[]>([]);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const normalizedQuery = useMemo(() => query.trim(), [query]);

  useEffect(() => {
    let active = true;

    Promise.all([
      getProductCategories(),
      getVendors(),
    ])
      .then(([categoryResponse, vendorResponse]) => {
        if (!active) return;
        setCategories(categoryResponse ?? []);
        setVendors(vendorResponse ?? []);
      })
      .catch(() => undefined);

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;
    const timer = window.setTimeout(() => {
      setLoading(true);
      setError(null);

      const request = normalizedQuery
        ? searchProducts({
            q: normalizedQuery || undefined,
            category: category || undefined,
            brand: brand || undefined,
            page,
            size,
          })
        : getAllProducts({
            categories: category ? [category] : undefined,
            brand: brand || undefined,
            page,
            size,
          });

      request
        .then((data) => {
          if (!active) return;
          setResults(data.content ?? []);
          setTotalElements(data.totalElements ?? 0);
          setTotalPages(data.totalPages ?? 0);
        })
        .catch((err) => {
          if (!active) return;
          setError(err instanceof Error ? err.message : "No se pudieron cargar los productos.");
          setResults([]);
          setTotalElements(0);
          setTotalPages(0);
        })
        .finally(() => {
          if (active) setLoading(false);
        });
    }, 250);

    return () => {
      active = false;
      window.clearTimeout(timer);
    };
  }, [normalizedQuery, category, brand, page, size]);

  const clearFilters = () => {
    setQuery("");
    setCategory("");
    setBrand("");
    setPage(0);
  };

  return (
    <AdminShell>
      <div className="space-y-6">
        <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-zinc-500">Productos</p>
          <h2 className="mt-2 text-2xl font-semibold text-zinc-950">Catálogo</h2>
          <p className="mt-2 text-sm text-zinc-600">Lista con buscador sobre Meilisearch, filtros y acceso a detalle.</p>
        </section>

        <section className="rounded-3xl border border-zinc-200 bg-white p-4 shadow-sm">
          <div className="grid gap-3 lg:grid-cols-[2fr_1fr_1fr_auto]">
            <input
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setPage(0);
              }}
              placeholder="Buscar por nombre, SKU o descripción"
              className="w-full rounded-xl border border-zinc-300 px-4 py-3 text-sm outline-none transition focus:border-zinc-950 focus:ring-2 focus:ring-zinc-950/10"
            />
            <select
              value={category}
              onChange={(event) => {
                setCategory(event.target.value);
                setPage(0);
              }}
              className="w-full rounded-xl border border-zinc-300 px-4 py-3 text-sm outline-none transition focus:border-zinc-950 focus:ring-2 focus:ring-zinc-950/10"
            >
              <option value="">Todas las categorías</option>
              {categories.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
            <select
              value={brand}
              onChange={(event) => {
                setBrand(event.target.value);
                setPage(0);
              }}
              className="w-full rounded-xl border border-zinc-300 px-4 py-3 text-sm outline-none transition focus:border-zinc-950 focus:ring-2 focus:ring-zinc-950/10"
            >
              <option value="">Todas las marcas</option>
              {vendors.map((vendor) => (
                <option key={vendor.vendorId} value={vendor.vendorId}>
                  {vendor.vendorName}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={clearFilters}
              className="rounded-xl border border-zinc-300 px-4 py-3 text-sm font-semibold text-zinc-700 transition hover:border-zinc-950 hover:text-zinc-950"
            >
              Limpiar
            </button>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm text-zinc-500">
            <p>
              {loading ? "Buscando productos..." : `${totalElements} resultado(s)`}
            </p>
            <p>Página {page + 1} de {Math.max(totalPages, 1)}</p>
          </div>
        </section>

        {error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
        ) : null}

        <section className="overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-zinc-200 text-sm">
              <thead className="bg-zinc-50 text-left text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
                <tr>
                  <th className="px-6 py-4">Producto</th>
                  <th className="px-6 py-4">SKU</th>
                  <th className="px-6 py-4">Categoría</th>
                  <th className="px-6 py-4">Precio</th>
                  <th className="px-6 py-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200">
                {!loading && results.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-10 text-center text-zinc-500">
                      No hay productos para mostrar.
                    </td>
                  </tr>
                ) : null}

                {results.map((product) => (
                  <tr key={product.id} className="hover:bg-zinc-50/80">
                    <td className="px-6 py-4">
                      <div className="font-medium text-zinc-950">{product.name}</div>
                      <div className="max-w-xl truncate text-xs text-zinc-500">{product.description ?? "Sin descripción"}</div>
                    </td>
                    <td className="px-6 py-4 text-zinc-600">{product.sku ?? "—"}</td>
                    <td className="px-6 py-4 text-zinc-600">{product.category ?? "—"}</td>
                    <td className="px-6 py-4 text-zinc-600">${Number(product.price ?? 0).toFixed(2)}</td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`/productos/${product.id}`}
                        className="rounded-xl bg-zinc-950 px-4 py-2 text-xs font-semibold text-white transition hover:bg-red-600"
                      >
                        Editar
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between gap-3 border-t border-zinc-200 px-4 py-4">
            <button
              type="button"
              disabled={page <= 0 || loading}
              onClick={() => setPage((current) => Math.max(current - 1, 0))}
              className="rounded-xl border border-zinc-300 px-4 py-2 text-sm font-semibold text-zinc-700 transition disabled:cursor-not-allowed disabled:opacity-50"
            >
              Anterior
            </button>
            <button
              type="button"
              disabled={loading || page + 1 >= totalPages}
              onClick={() => setPage((current) => current + 1)}
              className="rounded-xl border border-zinc-300 px-4 py-2 text-sm font-semibold text-zinc-700 transition disabled:cursor-not-allowed disabled:opacity-50"
            >
              Siguiente
            </button>
          </div>
        </section>
      </div>
    </AdminShell>
  );
}
