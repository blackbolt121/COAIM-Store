"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AdminShell } from "@/components/admin-shell";
import { createPromotion } from "@/lib/api";
import { PromotionForm, type PromotionFormValues } from "@/components/carousel/promotion-form";

export default function CreateCarouselPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (values: PromotionFormValues) => {
    if (!values.imageFile) {
      setError("La imagen es obligatoria.");
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("title", values.title);
      formData.append("startDate", values.startDate);
      formData.append("endDate", values.endDate);
      formData.append("displayOrder", String(values.displayOrder));
      formData.append("active", String(values.active));
      formData.append("image", values.imageFile);

      await createPromotion(formData);
      router.replace("/carousel");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo crear la promoción.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminShell>
      <div className="space-y-6">
        <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-zinc-500">Carousel</p>
          <h2 className="mt-2 text-2xl font-semibold text-zinc-950">Crear promoción</h2>
          <p className="mt-2 text-sm text-zinc-600">Crea un banner para el carousel público con imagen, fechas y orden.</p>
        </section>

        {error ? <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div> : null}

        <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
          <PromotionForm
            mode="create"
            submitLabel="Guardar promoción"
            cancelHref="/carousel"
            isSubmitting={saving}
            onSubmit={handleSubmit}
          />
        </section>
      </div>
    </AdminShell>
  );
}
