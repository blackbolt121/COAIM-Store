"use client";

import { useParams, useRouter } from "next/navigation";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { AdminShell } from "@/components/admin-shell";
import {
  AdminUser,
  EntityRef,
  getAdminGroups,
  getAdminRoles,
  getAdminUser,
  updateAdminUser,
} from "@/lib/api";
import municipiosPorEstado from "@/lib/mexico";

const paises = [{ label: "México", value: "MX" }] as const;
const estadosDeMexico = [
  { label: "Aguascalientes", value: "AG" },
  { label: "Baja California", value: "BC" },
  { label: "Baja California Sur", value: "BS" },
  { label: "Campeche", value: "CM" },
  { label: "Chiapas", value: "CS" },
  { label: "Chihuahua", value: "CH" },
  { label: "Ciudad de México", value: "CX" },
  { label: "Coahuila", value: "CO" },
  { label: "Colima", value: "CL" },
  { label: "Durango", value: "DG" },
  { label: "Guanajuato", value: "GT" },
  { label: "Guerrero", value: "GR" },
  { label: "Hidalgo", value: "HG" },
  { label: "Jalisco", value: "JA" },
  { label: "México", value: "EM" },
  { label: "Michoacán", value: "MI" },
  { label: "Morelos", value: "MO" },
  { label: "Nayarit", value: "NA" },
  { label: "Nuevo León", value: "NL" },
  { label: "Oaxaca", value: "OA" },
  { label: "Puebla", value: "PU" },
  { label: "Querétaro", value: "QT" },
  { label: "Quintana Roo", value: "QR" },
  { label: "San Luis Potosí", value: "SL" },
  { label: "Sinaloa", value: "SI" },
  { label: "Sonora", value: "SO" },
  { label: "Tabasco", value: "TB" },
  { label: "Tamaulipas", value: "TM" },
  { label: "Tlaxcala", value: "TL" },
  { label: "Veracruz", value: "VE" },
  { label: "Yucatán", value: "YU" },
  { label: "Zacatecas", value: "ZA" },
] as const;

function normalizePaisValue(value?: string | null) {
  return value?.toUpperCase() === "MX" ? "MX" : "MX";
}

function normalizeEstadoValue(value?: string | null) {
  if (!value) return "";

  const directMatch = estadosDeMexico.find((estado) => estado.value === value);
  if (directMatch) return directMatch.value;

  const labelMatch = estadosDeMexico.find((estado) => estado.label.toLowerCase() === value.toLowerCase());
  return labelMatch?.value ?? value;
}

function formatRoleLabel(name: string) {
  return name.replace(/^ROLE_/, "").toLowerCase();
}

function EntityChip({
  label,
  tone = "neutral",
  onRemove,
}: {
  label: string;
  tone?: "neutral" | "blue";
  onRemove?: () => void;
}) {
  const toneClasses = tone === "blue"
    ? "bg-blue-50 text-blue-700 border-blue-100"
    : "bg-zinc-900 text-white border-zinc-900";

  return (
    <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold ${toneClasses}`}>
      {label}
      {onRemove ? (
        <button type="button" onClick={onRemove} className="text-current/80 transition hover:text-current" aria-label={`Quitar ${label}`}>
          ×
        </button>
      ) : null}
    </span>
  );
}

export default function UsuarioDetallePage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [user, setUser] = useState<AdminUser | null>(null);
  const [allRoles, setAllRoles] = useState<EntityRef[]>([]);
  const [allGroups, setAllGroups] = useState<EntityRef[]>([]);
  const [selectedRoleIds, setSelectedRoleIds] = useState<number[]>([]);
  const [selectedGroupIds, setSelectedGroupIds] = useState<number[]>([]);
  const [roleSearch, setRoleSearch] = useState("");
  const [groupSearch, setGroupSearch] = useState("");
  const [pais, setPais] = useState("MX");
  const [estado, setEstado] = useState("");
  const [ciudad, setCiudad] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const municipioOptions = useMemo(() => {
    const options = estado ? municipiosPorEstado[estado] ?? [] : [];
    if (!ciudad || options.includes(ciudad)) {
      return options;
    }

    return [ciudad, ...options];
  }, [ciudad, estado]);

  const estadoOptions = useMemo(() => {
    if (!estado) {
      return estadosDeMexico;
    }

    const exists = estadosDeMexico.some((option) => option.value === estado);
    return exists ? estadosDeMexico : [{ label: estado, value: estado }, ...estadosDeMexico];
  }, [estado]);

  const selectedRoles = useMemo(
    () => allRoles.filter((role) => selectedRoleIds.includes(role.id)),
    [allRoles, selectedRoleIds],
  );
  const selectedGroups = useMemo(
    () => allGroups.filter((group) => selectedGroupIds.includes(group.id)),
    [allGroups, selectedGroupIds],
  );

  const filteredRoles = useMemo(() => {
    const term = roleSearch.trim().toLowerCase();
    return allRoles.filter((role) => {
      if (selectedRoleIds.includes(role.id)) return false;
      if (!term) return true;
      return role.name.toLowerCase().includes(term) || formatRoleLabel(role.name).includes(term);
    });
  }, [allRoles, roleSearch, selectedRoleIds]);

  const filteredGroups = useMemo(() => {
    const term = groupSearch.trim().toLowerCase();
    return allGroups.filter((group) => {
      if (selectedGroupIds.includes(group.id)) return false;
      if (!term) return true;
      return group.name.toLowerCase().includes(term);
    });
  }, [allGroups, groupSearch, selectedGroupIds]);

  useEffect(() => {
    let active = true;

    Promise.all([getAdminUser(params.id), getAdminRoles(), getAdminGroups()])
      .then(([data, roles, groups]) => {
        if (!active) return;
        setUser(data);
        setAllRoles(roles ?? []);
        setAllGroups(groups ?? []);
        setSelectedRoleIds(data.roles?.map((role) => role.id) ?? []);
        setSelectedGroupIds(data.groups?.map((group) => group.id) ?? []);
        setPais(normalizePaisValue(data.pais));
        setEstado(normalizeEstadoValue(data.estado));
        setCiudad(data.ciudad ?? "");
      })
      .catch((err) => {
        if (!active) return;
        setError(err instanceof Error ? err.message : "No se pudo cargar el usuario.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [params.id]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!user) return;

    setSaving(true);
    setError(null);

    const formData = new FormData(event.currentTarget);

    try {
      const updated = await updateAdminUser(params.id, {
        name: String(formData.get("name") ?? ""),
        email: String(formData.get("email") ?? ""),
        telefono: String(formData.get("telefono") ?? ""),
        calle: String(formData.get("calle") ?? ""),
        ciudad,
        estado,
        pais,
        codigoPostal: String(formData.get("codigoPostal") ?? ""),
        activo: formData.get("activo") === "on",
        roleIds: selectedRoleIds,
        groupIds: selectedGroupIds,
      });

      setUser(updated);
      setSelectedRoleIds(updated.roles?.map((role) => role.id) ?? selectedRoleIds);
      setSelectedGroupIds(updated.groups?.map((group) => group.id) ?? selectedGroupIds);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo guardar el usuario.");
    } finally {
      setSaving(false);
    }
  };

  const addRole = (id: number) => setSelectedRoleIds((current) => (current.includes(id) ? current : [...current, id]));
  const removeRole = (id: number) => setSelectedRoleIds((current) => current.filter((currentId) => currentId !== id));
  const addGroup = (id: number) => setSelectedGroupIds((current) => (current.includes(id) ? current : [...current, id]));
  const removeGroup = (id: number) => setSelectedGroupIds((current) => current.filter((currentId) => currentId !== id));

  return (
    <AdminShell>
      <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-zinc-500">Usuarios</p>
        <h2 className="mt-2 text-2xl font-semibold text-zinc-950">Detalle de usuario</h2>
        <p className="mt-2 text-sm text-zinc-600">Edita datos, roles y grupos con una experiencia tipo Jira.</p>

        {loading ? <div className="mt-6 text-sm text-zinc-500">Cargando usuario...</div> : null}
        {error ? <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div> : null}

        {user ? (
          <form onSubmit={handleSubmit} className="mt-6 space-y-8">
            <div className="grid gap-4 md:grid-cols-2">
              {[
                ["name", "Nombre", user.name],
                ["email", "Correo", user.email],
                ["telefono", "Teléfono", user.telefono ?? ""],
                ["calle", "Calle", user.calle ?? ""],
                ["codigoPostal", "Código postal", user.codigoPostal ?? ""],
              ].map(([name, label, value]) => (
                <label key={name} className="space-y-2">
                  <span className="text-sm font-medium text-zinc-700">{label}</span>
                  <input
                    name={name}
                    defaultValue={value}
                    className="w-full rounded-xl border border-zinc-300 px-4 py-3 outline-none transition focus:border-zinc-950 focus:ring-2 focus:ring-zinc-950/10"
                  />
                </label>
              ))}

              <label className="space-y-2">
                <span className="text-sm font-medium text-zinc-700">País</span>
                <select
                  name="pais"
                  value={pais}
                  onChange={(event) => setPais(event.target.value)}
                  className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 outline-none transition focus:border-zinc-950 focus:ring-2 focus:ring-zinc-950/10"
                >
                  {paises.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>

              <label className="space-y-2">
                <span className="text-sm font-medium text-zinc-700">Estado</span>
                <select
                  name="estado"
                  value={estado}
                  onChange={(event) => {
                    setEstado(event.target.value);
                    setCiudad("");
                  }}
                  className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 outline-none transition focus:border-zinc-950 focus:ring-2 focus:ring-zinc-950/10"
                >
                  <option value="">Selecciona un estado…</option>
                  {estadoOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>

              <label className="space-y-2">
                <span className="text-sm font-medium text-zinc-700">Ciudad / Municipio</span>
                <select
                  name="ciudad"
                  value={ciudad}
                  onChange={(event) => setCiudad(event.target.value)}
                  disabled={!estado}
                  className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 outline-none transition focus:border-zinc-950 focus:ring-2 focus:ring-zinc-950/10 disabled:cursor-not-allowed disabled:bg-zinc-100"
                >
                  <option value="">{estado ? "Selecciona una ciudad…" : "Primero selecciona un estado"}</option>
                  {municipioOptions.map((municipio) => (
                    <option key={municipio} value={municipio}>
                      {municipio}
                    </option>
                  ))}
                </select>
              </label>

              <label className="flex items-center gap-3 rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-4 md:col-span-2">
                <input name="activo" type="checkbox" defaultChecked={Boolean(user.activo)} className="h-4 w-4 rounded border-zinc-300" />
                <span className="text-sm font-medium text-zinc-700">Usuario activo</span>
              </label>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <section className="rounded-3xl border border-zinc-200 bg-zinc-50 p-5">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-semibold text-zinc-950">Roles</h3>
                    <p className="text-sm text-zinc-600">Asigna o quita roles al usuario.</p>
                  </div>
                  <span className="rounded-full bg-zinc-900 px-3 py-1 text-xs font-semibold text-white">{selectedRoles.length} asignado(s)</span>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {selectedRoles.length ? selectedRoles.map((role) => (
                    <EntityChip key={role.id} label={formatRoleLabel(role.name)} onRemove={() => removeRole(role.id)} />
                  )) : <p className="text-sm text-zinc-500">Sin roles asignados.</p>}
                </div>

                <div className="mt-5 space-y-3">
                  <input
                    value={roleSearch}
                    onChange={(event) => setRoleSearch(event.target.value)}
                    placeholder="Buscar roles disponibles"
                    className="w-full rounded-xl border border-zinc-300 px-4 py-3 text-sm outline-none transition focus:border-zinc-950 focus:ring-2 focus:ring-zinc-950/10"
                  />
                  <div className="flex flex-wrap gap-2">
                    {filteredRoles.length ? filteredRoles.map((role) => (
                      <button
                        key={role.id}
                        type="button"
                        onClick={() => addRole(role.id)}
                        className="rounded-full border border-zinc-300 bg-white px-3 py-1 text-xs font-semibold text-zinc-700 transition hover:border-zinc-950 hover:text-zinc-950"
                      >
                        + {formatRoleLabel(role.name)}
                      </button>
                    )) : <p className="text-sm text-zinc-500">No hay roles disponibles para agregar.</p>}
                  </div>
                </div>
              </section>

              <section className="rounded-3xl border border-zinc-200 bg-zinc-50 p-5">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-semibold text-zinc-950">Grupos</h3>
                    <p className="text-sm text-zinc-600">Agrupa usuarios por equipo o área.</p>
                  </div>
                  <span className="rounded-full bg-blue-600 px-3 py-1 text-xs font-semibold text-white">{selectedGroups.length} asignado(s)</span>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {selectedGroups.length ? selectedGroups.map((group) => (
                    <EntityChip key={group.id} label={group.name} tone="blue" onRemove={() => removeGroup(group.id)} />
                  )) : <p className="text-sm text-zinc-500">Sin grupos asignados.</p>}
                </div>

                <div className="mt-5 space-y-3">
                  <input
                    value={groupSearch}
                    onChange={(event) => setGroupSearch(event.target.value)}
                    placeholder="Buscar grupos disponibles"
                    className="w-full rounded-xl border border-zinc-300 px-4 py-3 text-sm outline-none transition focus:border-zinc-950 focus:ring-2 focus:ring-zinc-950/10"
                  />
                  <div className="flex flex-wrap gap-2">
                    {filteredGroups.length ? filteredGroups.map((group) => (
                      <button
                        key={group.id}
                        type="button"
                        onClick={() => addGroup(group.id)}
                        className="rounded-full border border-blue-200 bg-white px-3 py-1 text-xs font-semibold text-blue-700 transition hover:border-blue-600 hover:text-blue-900"
                      >
                        + {group.name}
                      </button>
                    )) : <p className="text-sm text-zinc-500">No hay grupos disponibles para agregar.</p>}
                  </div>
                </div>
              </section>
            </div>

            <div className="flex flex-wrap gap-3 border-t border-zinc-200 pt-6">
              <button
                type="submit"
                disabled={saving}
                className="rounded-xl bg-zinc-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? "Guardando..." : "Guardar cambios"}
              </button>
            </div>
          </form>
        ) : null}
      </section>
    </AdminShell>
  );
}
