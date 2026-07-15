import { AdminShell } from "@/components/admin-shell";

type ModulePlaceholderProps = {
  title: string;
  description: string;
  bullets: string[];
};

export function ModulePlaceholder({ title, description, bullets }: ModulePlaceholderProps) {
  return (
    <AdminShell>
      <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-zinc-500">Próximo módulo</p>
        <h2 className="mt-2 text-2xl font-semibold text-zinc-950">{title}</h2>
        <p className="mt-3 max-w-2xl text-sm text-zinc-600">{description}</p>

        <div className="mt-6 rounded-2xl border border-dashed border-zinc-200 bg-zinc-50 p-5">
          <h3 className="text-sm font-semibold text-zinc-950">Incluye</h3>
          <ul className="mt-3 space-y-2 text-sm text-zinc-600">
            {bullets.map((bullet) => (
              <li key={bullet}>• {bullet}</li>
            ))}
          </ul>
        </div>
      </section>
    </AdminShell>
  );
}
