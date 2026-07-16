"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { AdminShell } from "@/components/admin-shell";
import { createAdminGroup, deleteAdminGroup, EntityRef, getAdminGroups, updateAdminGroup } from "@/lib/api";

export default function GroupsPage() {
  const [groups, setGroups] = useState<EntityRef[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [creatingName, setCreatingName] = useState("");
  const [savingId, setSavingId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingName, setEditingName] = useState("");

  useEffect(() => {
    let alive = true;

    getAdminGroups()
      .then((items) => {
        if (!alive) return;
        setGroups(items ?? []);
      })
      .catch((err) => {
        if (!alive) return;
        setError(err instanceof Error ? err.message : "No se pudieron cargar los grupos.");
      })
      .finally(() => {
        if (alive) setLoading(false);
      });

    return () => {
      alive = false;
    };
  }, []);

  const sortedGroups = useMemo(() => [...groups].sort((a, b) => a.name.localeCompare(b.name)), [groups]);

  const handleCreate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const name = creatingName.trim();
    if (!name) return;

    setError(null);
    try {
      const created = await createAdminGroup({ name });
      setGroups((current) => [...current, created]);
      setCreatingName("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo crear el grupo.");
    }
  };

  const startEdit = (group: EntityRef) => {
    setEditingId(group.id);
    setEditingName(group.name);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingName("");
  };

  const handleSave = async (id: number) => {
    const name = editingName.trim();
    if (!name) return;

    setSavingId(id);
    setError(null);

    try {
      const updated = await updateAdminGroup(id, { name });
      setGroups((current) => current.map((group) => (group.id === id ? updated : group)));
      cancelEdit();
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo actualizar el grupo.");
    } finally {
      setSavingId(null);
    }
  };

  const handleDelete = async (id: number) => {
    const confirmed = window.confirm("¿Eliminar este grupo?");
    if (!confirmed) return;

    setDeletingId(id);
    setError(null);

    try {
      await deleteAdminGroup(id);
      setGroups((current) => current.filter((group) => group.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo eliminar el grupo.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <AdminShell>
      <div className="space-y-6">
        <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-zinc-500">Grupos</p>
              <h2 className="mt-2 text-2xl font-semibold text-zinc-950">Administración de grupos</h2>
              <p className="mt-2 text-sm text-zinc-600">Crea grupos de usuarios para organización interna.</p>
            </div>
          </div>
        </section>

        {error ? <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div> : null}

        <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
          <form onSubmit={handleCreate} className="flex flex-col gap-3 sm:flex-row">
            <input
              value={creatingName}
              onChange={(event) => setCreatingName(event.target.value)}
              placeholder="Ventas, Operaciones, etc."
              className="w-full rounded-xl border border-zinc-300 px-4 py-3 text-sm outline-none transition focus:border-zinc-950 focus:ring-2 focus:ring-zinc-950/10"
            />
            <button type="submit" className="rounded-xl bg-zinc-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-600">
              Crear grupo
            </button>
          </form>
        </section>

        <section className="overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-zinc-200 text-sm">
              <thead className="bg-zinc-50 text-left text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
                <tr>
                  <th className="px-6 py-4">Nombre</th>
                  <th className="px-6 py-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200">
                {!loading && sortedGroups.length === 0 ? (
                  <tr>
                    <td colSpan={2} className="px-6 py-10 text-center text-zinc-500">
                      No hay grupos registrados.
                    </td>
                  </tr>
                ) : null}

                {sortedGroups.map((group) => (
                  <tr key={group.id} className="hover:bg-zinc-50/80">
                    <td className="px-6 py-4 font-medium text-zinc-950">
                      {editingId === group.id ? (
                        <input
                          value={editingName}
                          onChange={(event) => setEditingName(event.target.value)}
                          className="w-full rounded-xl border border-zinc-300 px-3 py-2 text-sm outline-none transition focus:border-zinc-950 focus:ring-2 focus:ring-zinc-950/10"
                        />
                      ) : (
                        group.name
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="inline-flex gap-3">
                        {editingId === group.id ? (
                          <>
                            <button
                              type="button"
                              onClick={() => handleSave(group.id)}
                              disabled={savingId === group.id}
                              className="rounded-xl border border-zinc-300 px-4 py-2 text-xs font-semibold text-zinc-700 transition hover:border-zinc-950 hover:text-zinc-950 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                              {savingId === group.id ? "Guardando..." : "Guardar"}
                            </button>
                            <button
                              type="button"
                              onClick={cancelEdit}
                              className="rounded-xl border border-zinc-300 px-4 py-2 text-xs font-semibold text-zinc-700 transition hover:border-zinc-950 hover:text-zinc-950"
                            >
                              Cancelar
                            </button>
                          </>
                        ) : (
                          <button
                            type="button"
                            onClick={() => startEdit(group)}
                            className="rounded-xl border border-zinc-300 px-4 py-2 text-xs font-semibold text-zinc-700 transition hover:border-zinc-950 hover:text-zinc-950"
                          >
                            Editar
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => handleDelete(group.id)}
                          disabled={deletingId === group.id}
                          className="rounded-xl border border-red-200 px-4 py-2 text-xs font-semibold text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {deletingId === group.id ? "Eliminando..." : "Eliminar"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {loading ? <div className="border-t border-zinc-200 px-6 py-6 text-sm text-zinc-500">Cargando grupos...</div> : null}
        </section>
      </div>
    </AdminShell>
  );
}
