"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { AdminShell } from "@/components/admin-shell";
import { createAdminRole, deleteAdminRole, EntityRef, getAdminRoles, updateAdminRole } from "@/lib/api";

function formatRoleLabel(name: string) {
  return name.replace(/^ROLE_/, "").toLowerCase();
}

function normalizeRoleName(name: string) {
  const value = name.trim();
  if (!value) return "";
  return value.startsWith("ROLE_") ? value : `ROLE_${value.replace(/\s+/g, "_").toUpperCase()}`;
}

export default function RolesPage() {
  const [roles, setRoles] = useState<EntityRef[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [creatingName, setCreatingName] = useState("");
  const [savingId, setSavingId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingName, setEditingName] = useState("");

  useEffect(() => {
    let alive = true;

    getAdminRoles()
      .then((items) => {
        if (!alive) return;
        setRoles(items ?? []);
      })
      .catch((err) => {
        if (!alive) return;
        setError(err instanceof Error ? err.message : "No se pudieron cargar los roles.");
      })
      .finally(() => {
        if (alive) setLoading(false);
      });

    return () => {
      alive = false;
    };
  }, []);

  const sortedRoles = useMemo(() => [...roles].sort((a, b) => a.name.localeCompare(b.name)), [roles]);

  const handleCreate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const name = normalizeRoleName(creatingName);
    if (!name) return;

    setError(null);
    try {
      const created = await createAdminRole({ name });
      setRoles((current) => [...current, created]);
      setCreatingName("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo crear el rol.");
    }
  };

  const startEdit = (role: EntityRef) => {
    setEditingId(role.id);
    setEditingName(role.name);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingName("");
  };

  const handleSave = async (id: number) => {
    const name = normalizeRoleName(editingName);
    if (!name) return;

    setSavingId(id);
    setError(null);

    try {
      const updated = await updateAdminRole(id, { name });
      setRoles((current) => current.map((role) => (role.id === id ? updated : role)));
      cancelEdit();
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo actualizar el rol.");
    } finally {
      setSavingId(null);
    }
  };

  const handleDelete = async (id: number) => {
    const confirmed = window.confirm("¿Eliminar este rol?");
    if (!confirmed) return;

    setDeletingId(id);
    setError(null);

    try {
      await deleteAdminRole(id);
      setRoles((current) => current.filter((role) => role.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo eliminar el rol.");
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
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-zinc-500">Roles</p>
              <h2 className="mt-2 text-2xl font-semibold text-zinc-950">Administración de roles</h2>
              <p className="mt-2 text-sm text-zinc-600">Crea y mantiene roles globales del sistema.</p>
            </div>
          </div>
        </section>

        {error ? <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div> : null}

        <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
          <form onSubmit={handleCreate} className="flex flex-col gap-3 sm:flex-row">
            <input
              value={creatingName}
              onChange={(event) => setCreatingName(event.target.value)}
              placeholder="ROLE_SUPPORT o soporte"
              className="w-full rounded-xl border border-zinc-300 px-4 py-3 text-sm outline-none transition focus:border-zinc-950 focus:ring-2 focus:ring-zinc-950/10"
            />
            <button type="submit" className="rounded-xl bg-zinc-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-600">
              Crear rol
            </button>
          </form>
        </section>

        <section className="overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-zinc-200 text-sm">
              <thead className="bg-zinc-50 text-left text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
                <tr>
                  <th className="px-6 py-4">Nombre</th>
                  <th className="px-6 py-4">Etiqueta</th>
                  <th className="px-6 py-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200">
                {!loading && sortedRoles.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-6 py-10 text-center text-zinc-500">
                      No hay roles registrados.
                    </td>
                  </tr>
                ) : null}

                {sortedRoles.map((role) => (
                  <tr key={role.id} className="hover:bg-zinc-50/80">
                    <td className="px-6 py-4 font-medium text-zinc-950">
                      {editingId === role.id ? (
                        <input
                          value={editingName}
                          onChange={(event) => setEditingName(event.target.value)}
                          className="w-full rounded-xl border border-zinc-300 px-3 py-2 text-sm outline-none transition focus:border-zinc-950 focus:ring-2 focus:ring-zinc-950/10"
                        />
                      ) : (
                        role.name
                      )}
                    </td>
                    <td className="px-6 py-4 text-zinc-600">{formatRoleLabel(role.name)}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="inline-flex gap-3">
                        {editingId === role.id ? (
                          <>
                            <button
                              type="button"
                              onClick={() => handleSave(role.id)}
                              disabled={savingId === role.id}
                              className="rounded-xl border border-zinc-300 px-4 py-2 text-xs font-semibold text-zinc-700 transition hover:border-zinc-950 hover:text-zinc-950 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                              {savingId === role.id ? "Guardando..." : "Guardar"}
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
                            onClick={() => startEdit(role)}
                            className="rounded-xl border border-zinc-300 px-4 py-2 text-xs font-semibold text-zinc-700 transition hover:border-zinc-950 hover:text-zinc-950"
                          >
                            Editar
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => handleDelete(role.id)}
                          disabled={deletingId === role.id}
                          className="rounded-xl border border-red-200 px-4 py-2 text-xs font-semibold text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {deletingId === role.id ? "Eliminando..." : "Eliminar"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {loading ? <div className="border-t border-zinc-200 px-6 py-6 text-sm text-zinc-500">Cargando roles...</div> : null}
        </section>
      </div>
    </AdminShell>
  );
}
