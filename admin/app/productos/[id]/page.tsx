"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { AdminShell } from "@/components/admin-shell";
import { getProductById, getProductCategories, getVendors, Product, updateProduct, Vendor } from "@/lib/api";

export default function ProductoDetallePage() {
  const params = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedVendorId, setSelectedVendorId] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    Promise.all([
      getProductById(params.id),
      getVendors().catch(() => []),
      getProductCategories().catch(() => []),
    ])
      .then(([productResponse, vendorResponse, categoryResponse]) => {
        if (!active) return;
        setProduct(productResponse);
        setVendors(vendorResponse ?? []);
        setCategories(categoryResponse ?? []);
        setSelectedVendorId(
          String(productResponse.vendor?.vendorId ?? productResponse.vendor?.id ?? ""),
        );
      })
      .catch((err) => {
        if (!active) return;
        setError(err instanceof Error ? err.message : "No se pudo cargar el producto.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [params.id]);

  const currentVendor = useMemo(
    () => vendors.find((vendor) => vendor.vendorId === selectedVendorId) ?? null,
    [selectedVendorId, vendors],
  );

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!product) return;

    setSaving(true);
    setError(null);
    setSuccess(null);

    const formData = new FormData(event.currentTarget);

    const vendor = currentVendor
      ? { vendorId: currentVendor.vendorId, vendorName: currentVendor.vendorName }
      : null;

    try {
      const updated = await updateProduct(params.id, {
        ...product,
        name: String(formData.get("name") ?? ""),
        sku: String(formData.get("sku") ?? ""),
        description: String(formData.get("description") ?? ""),
        price: Number(formData.get("price") ?? 0),
        imageUrl: String(formData.get("imageUrl") ?? ""),
        category: String(formData.get("category") ?? ""),
        vendor,
      });

      setProduct(updated);
      setSuccess("Producto actualizado correctamente.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo guardar el producto.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminShell>
      <div className="space-y-6">
        <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-zinc-500">Productos</p>
          <h2 className="mt-2 text-2xl font-semibold text-zinc-950">Edición de producto</h2>
          <p className="mt-2 text-sm text-zinc-600">Edita información básica, imagen, categoría y marca.</p>
        </section>

        {loading ? <div className="rounded-2xl border border-zinc-200 bg-white p-6 text-sm text-zinc-500 shadow-sm">Cargando producto...</div> : null}
        {error ? <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div> : null}
        {success ? <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{success}</div> : null}

        {product ? (
          <section className="grid gap-6 rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm lg:grid-cols-[280px_1fr]">
            <div className="space-y-4">
              <div className="flex items-center justify-center rounded-2xl border border-zinc-200 bg-zinc-50 p-6">
                {product.imageUrl ? (
                  <Image
                    src={product.imageUrl}
                    alt={product.name}
                    width={480}
                    height={480}
                    unoptimized
                    className="max-h-72 w-full object-contain"
                  />
                ) : (
                  <div className="text-center text-sm text-zinc-500">Sin imagen disponible</div>
                )}
              </div>

              <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 text-sm text-zinc-600">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">Vista previa</p>
                <p className="mt-2 font-medium text-zinc-950">{product.name}</p>
                <p className="mt-1">{product.category ?? "Sin categoría"}</p>
                <p className="mt-1">${Number(product.price ?? 0).toFixed(2)}</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid gap-4 md:grid-cols-2">
                <label className="space-y-2 md:col-span-2">
                  <span className="text-sm font-medium text-zinc-700">Nombre</span>
                  <input
                    name="name"
                    defaultValue={product.name}
                    className="w-full rounded-xl border border-zinc-300 px-4 py-3 outline-none transition focus:border-zinc-950 focus:ring-2 focus:ring-zinc-950/10"
                  />
                </label>

                <label className="space-y-2">
                  <span className="text-sm font-medium text-zinc-700">SKU</span>
                  <input
                    name="sku"
                    defaultValue={product.sku ?? ""}
                    className="w-full rounded-xl border border-zinc-300 px-4 py-3 outline-none transition focus:border-zinc-950 focus:ring-2 focus:ring-zinc-950/10"
                  />
                </label>

                <label className="space-y-2">
                  <span className="text-sm font-medium text-zinc-700">Precio</span>
                  <input
                    name="price"
                    type="number"
                    step="0.01"
                    defaultValue={product.price ?? 0}
                    className="w-full rounded-xl border border-zinc-300 px-4 py-3 outline-none transition focus:border-zinc-950 focus:ring-2 focus:ring-zinc-950/10"
                  />
                </label>

                <label className="space-y-2 md:col-span-2">
                  <span className="text-sm font-medium text-zinc-700">Descripción</span>
                  <textarea
                    name="description"
                    rows={5}
                    defaultValue={product.description ?? ""}
                    className="w-full rounded-xl border border-zinc-300 px-4 py-3 outline-none transition focus:border-zinc-950 focus:ring-2 focus:ring-zinc-950/10"
                  />
                </label>

                <label className="space-y-2">
                  <span className="text-sm font-medium text-zinc-700">Categoría</span>
                  <select
                    name="category"
                    defaultValue={product.category ?? ""}
                    className="w-full rounded-xl border border-zinc-300 px-4 py-3 outline-none transition focus:border-zinc-950 focus:ring-2 focus:ring-zinc-950/10"
                  >
                    <option value="">Sin categoría</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="space-y-2">
                  <span className="text-sm font-medium text-zinc-700">Marca</span>
                  <select
                    value={selectedVendorId}
                    onChange={(event) => setSelectedVendorId(event.target.value)}
                    className="w-full rounded-xl border border-zinc-300 px-4 py-3 outline-none transition focus:border-zinc-950 focus:ring-2 focus:ring-zinc-950/10"
                  >
                    <option value="">Sin marca</option>
                    {vendors.map((vendor) => (
                      <option key={vendor.vendorId} value={vendor.vendorId}>
                        {vendor.vendorName}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="space-y-2 md:col-span-2">
                  <span className="text-sm font-medium text-zinc-700">Imagen URL</span>
                  <input
                    name="imageUrl"
                    defaultValue={product.imageUrl ?? ""}
                    className="w-full rounded-xl border border-zinc-300 px-4 py-3 outline-none transition focus:border-zinc-950 focus:ring-2 focus:ring-zinc-950/10"
                  />
                </label>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-xl bg-zinc-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving ? "Guardando..." : "Guardar cambios"}
                </button>
                <Link href="/productos" className="rounded-xl border border-zinc-300 px-5 py-3 text-sm font-semibold text-zinc-700 transition hover:border-zinc-950 hover:text-zinc-950">
                  Volver a productos
                </Link>
              </div>
            </form>
          </section>
        ) : null}
      </div>
    </AdminShell>
  );
}
