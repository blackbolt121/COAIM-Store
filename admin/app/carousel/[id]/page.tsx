"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { AdminShell } from "@/components/admin-shell";
import {
  API_BASE_URL,
  deletePromotion,
  getPromotionById,
  Promotion,
  updatePromotion,
  updatePromotionImage,
} from "@/lib/api";
import { PromotionForm, type PromotionFormValues } from "@/components/carousel/promotion-form";

export default function CarouselDetallePage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [promotion, setPromotion] = useState<Promotion | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;

    getPromotionById(params.id)
      .then((item) => {
        if (!alive) return;
        setPromotion(item);
      })
      .catch((err) => {
        if (!alive) return;
        setError(err instanceof Error ? err.message : "No se pudo cargar la promoción.");
      })
      .finally(() => {
        if (alive) setLoading(false);
      });

    return () => {
      alive = false;
    };
  }, [params.id]);

  const handleSubmit = async (values: PromotionFormValues) => {
    setSaving(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("title", values.title);
      formData.append("startDate", values.startDate);
      formData.append("endDate", values.endDate);
      formData.append("displayOrder", String(values.displayOrder));
      formData.append("active", String(values.active));

      const updated = await updatePromotion(params.id, formData);

      if (values.imageFile) {
        const imageData = new FormData();
        imageData.append("image", values.imageFile);
        await updatePromotionImage(params.id, imageData);
      }

      setPromotion(updated);
      router.replace("/carousel");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo guardar la promoción.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    const confirmed = window.confirm("¿Eliminar esta promoción?");
    if (!confirmed) return;

    setSaving(true);
    setError(null);

    try {
      await deletePromotion(params.id);
      router.replace("/carousel");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo eliminar la promoción.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminShell>
      <div className="space-y-6">
        <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-zinc-500">Carousel</p>
          <h2 className="mt-2 text-2xl font-semibold text-zinc-950">Editar promoción</h2>
          <p className="mt-2 text-sm text-zinc-600">Actualiza texto, fechas, orden, estado e imagen del banner.</p>
        </section>

        {loading ? <div className="rounded-2xl border border-zinc-200 bg-white p-6 text-sm text-zinc-500 shadow-sm">Cargando promoción...</div> : null}
        {error ? <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div> : null}
        {!loading && !error && !promotion ? (
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 text-sm text-zinc-500 shadow-sm">
            La promoción no existe o fue eliminada.
          </div>
        ) : null}

        {promotion ? (
          <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
            <PromotionForm
              mode="edit"
              submitLabel="Guardar cambios"
              cancelHref="/carousel"
              initialValues={{
                title: promotion.title,
                startDate: promotion.startDate ?? "",
                endDate: promotion.endDate ?? "",
                displayOrder: promotion.displayOrder ?? 0,
                active: promotion.active,
              }}
              initialImageUrl={`${API_BASE_URL}/rest/api/1/promotions/${encodeURIComponent(promotion.id)}/image`}
              isSubmitting={saving}
              onSubmit={handleSubmit}
            />

            <div className="mt-6 flex flex-wrap gap-3 border-t border-zinc-200 pt-6">
              <button
                type="button"
                onClick={handleDelete}
                disabled={saving}
                className="rounded-xl border border-red-200 px-5 py-3 text-sm font-semibold text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? "Procesando..." : "Eliminar promoción"}
              </button>
            </div>
          </section>
        ) : null}
      </div>
    </AdminShell>
  );
}
