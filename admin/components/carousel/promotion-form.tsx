"use client";

/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";

type PromotionFormValues = {
  title: string;
  startDate: string;
  endDate: string;
  displayOrder: number;
  active: boolean;
  imageFile?: File | null;
};

type PromotionFormProps = {
  mode: "create" | "edit";
  submitLabel: string;
  cancelHref: string;
  initialValues?: Partial<PromotionFormValues>;
  initialImageUrl?: string | null;
  isSubmitting?: boolean;
  onSubmit: (values: PromotionFormValues) => Promise<void>;
};

function normalizeDateTimeValue(value?: string | null) {
  if (!value) return "";
  return value.slice(0, 16);
}

export function PromotionForm({
  mode,
  submitLabel,
  cancelHref,
  initialValues,
  initialImageUrl,
  isSubmitting = false,
  onSubmit,
}: PromotionFormProps) {
  const [title, setTitle] = useState(initialValues?.title ?? "");
  const [startDate, setStartDate] = useState(normalizeDateTimeValue(initialValues?.startDate));
  const [endDate, setEndDate] = useState(normalizeDateTimeValue(initialValues?.endDate));
  const [displayOrder, setDisplayOrder] = useState(String(initialValues?.displayOrder ?? 0));
  const [active, setActive] = useState(initialValues?.active ?? true);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const previewUrl = useMemo(() => {
    if (imageFile) {
      return URL.createObjectURL(imageFile);
    }

    return initialImageUrl ?? null;
  }, [imageFile, initialImageUrl]);

  useEffect(() => {
    return () => {
      if (imageFile && previewUrl?.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [imageFile, previewUrl]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    await onSubmit({
      title: title.trim(),
      startDate,
      endDate,
      displayOrder: Number(displayOrder || 0),
      active,
      imageFile,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <label className="block space-y-2">
        <span className="text-sm font-medium text-zinc-700">Título</span>
        <input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          required
          placeholder="Ej. Promo invierno 2026"
          className="w-full rounded-xl border border-zinc-300 px-4 py-3 outline-none transition focus:border-zinc-950 focus:ring-2 focus:ring-zinc-950/10"
        />
      </label>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="block space-y-2">
          <span className="text-sm font-medium text-zinc-700">Fecha inicio</span>
          <input
            type="datetime-local"
            value={startDate}
            onChange={(event) => setStartDate(event.target.value)}
            required
            className="w-full rounded-xl border border-zinc-300 px-4 py-3 outline-none transition focus:border-zinc-950 focus:ring-2 focus:ring-zinc-950/10"
          />
          <p className="text-xs text-zinc-500">Define cuándo comienza a mostrarse.</p>
        </label>

        <label className="block space-y-2">
          <span className="text-sm font-medium text-zinc-700">Fecha fin</span>
          <input
            type="datetime-local"
            value={endDate}
            onChange={(event) => setEndDate(event.target.value)}
            required
            className="w-full rounded-xl border border-zinc-300 px-4 py-3 outline-none transition focus:border-zinc-950 focus:ring-2 focus:ring-zinc-950/10"
          />
          <p className="text-xs text-zinc-500">Define cuándo dejará de verse.</p>
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="block space-y-2">
          <span className="text-sm font-medium text-zinc-700">Orden de despliegue</span>
          <input
            type="number"
            min={0}
            step={1}
            value={displayOrder}
            onChange={(event) => setDisplayOrder(event.target.value)}
            required
            placeholder="0"
            className="w-full rounded-xl border border-zinc-300 px-4 py-3 outline-none transition focus:border-zinc-950 focus:ring-2 focus:ring-zinc-950/10"
          />
          <p className="text-xs text-zinc-500">Menor número = mayor prioridad.</p>
        </label>

        <label className="flex items-center gap-3 rounded-xl border border-zinc-300 px-4 py-3">
          <input
            type="checkbox"
            checked={active}
            onChange={(event) => setActive(event.target.checked)}
            className="h-4 w-4 rounded border-zinc-300 text-zinc-950 focus:ring-zinc-950"
          />
          <div>
            <span className="block text-sm font-medium text-zinc-700">Activa</span>
            <span className="block text-xs text-zinc-500">Visible en el carousel público.</span>
          </div>
        </label>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <label className="block space-y-2">
          <span className="text-sm font-medium text-zinc-700">Imagen</span>
          <input
            type="file"
            accept="image/*"
            onChange={(event) => setImageFile(event.target.files?.[0] ?? null)}
            required={mode === "create"}
            className="block w-full rounded-xl border border-zinc-300 px-4 py-3 text-sm file:mr-4 file:rounded-lg file:border-0 file:bg-zinc-950 file:px-4 file:py-2 file:text-white file:transition hover:file:bg-red-600"
          />
          <p className="text-xs text-zinc-500">Formato recomendado: JPG o PNG.</p>
        </label>

        <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">Vista previa</p>
          <div className="mt-3 flex min-h-56 items-center justify-center overflow-hidden rounded-xl border border-zinc-200 bg-white">
            {previewUrl ? (
              <img src={previewUrl} alt={title || "Vista previa de promoción"} className="max-h-80 w-full object-contain" />
            ) : (
              <p className="px-4 text-center text-sm text-zinc-500">
                {mode === "create" ? "Selecciona una imagen para ver la vista previa." : "La promoción no tiene imagen cargada."}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 pt-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-xl bg-zinc-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Guardando..." : submitLabel}
        </button>
        <Link
          href={cancelHref}
          className="rounded-xl border border-zinc-300 px-5 py-3 text-sm font-semibold text-zinc-700 transition hover:border-zinc-950 hover:text-zinc-950"
        >
          Cancelar
        </Link>
      </div>
    </form>
  );
}

export type { PromotionFormValues };
