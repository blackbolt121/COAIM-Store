"use client";

import { useParams, useRouter } from "next/navigation";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { AdminShell } from "@/components/admin-shell";
import { AdminUser, getAdminUser, updateAdminUser } from "@/lib/api";
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
const roleOptions = [
  { label: "Administrador", value: "ROLE_ADMIN" },
  { label: "Ventas", value: "ROLE_SALES" },
  { label: "Operador", value: "ROLE_OPERATOR" },
  { label: "Usuario", value: "ROLE_USER" },
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

export default function UsuarioDetallePage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [user, setUser] = useState<AdminUser | null>(null);
  const [roles, setRoles] = useState<string[]>([]);
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

  useEffect(() => {
    let active = true;
    getAdminUser(params.id)
      .then((data) => {
        if (!active) return;
        setUser(data);
        setRoles(data.roles ?? []);
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
        roles,
      });

      setUser(updated);
      setRoles(updated.roles ?? roles);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo guardar el usuario.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminShell>
      <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-zinc-500">Usuarios</p>
        <h2 className="mt-2 text-2xl font-semibold text-zinc-950">Detalle de usuario</h2>
        <p className="mt-2 text-sm text-zinc-600">Edita datos de contacto, dirección, estado y roles.</p>

        {loading ? <div className="mt-6 text-sm text-zinc-500">Cargando usuario...</div> : null}
        {error ? <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div> : null}

        {user ? (
          <form onSubmit={handleSubmit} className="mt-6 grid gap-4 md:grid-cols-2">
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
                <option value="">
                  {estado ? "Selecciona una ciudad…" : "Primero selecciona un estado"}
                </option>
                {municipioOptions.map((municipio) => (
                  <option key={municipio} value={municipio}>
                    {municipio}
                  </option>
                ))}
              </select>
            </label>

            <label className="space-y-2 md:col-span-2">
              <span className="text-sm font-medium text-zinc-700">Roles</span>
              <select
                multiple
                value={roles}
                onChange={(event) => {
                  const selected = Array.from(event.target.selectedOptions).map((option) => option.value);
                  setRoles(selected);
                }}
                className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 outline-none transition focus:border-zinc-950 focus:ring-2 focus:ring-zinc-950/10"
                size={roleOptions.length}
              >
                {roleOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <p className="text-xs text-zinc-500">Mantén presionada la tecla Ctrl o Cmd para seleccionar varios roles.</p>
            </label>

            <label className="flex items-center gap-3 rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-4">
              <input name="activo" type="checkbox" defaultChecked={Boolean(user.activo)} className="h-4 w-4 rounded border-zinc-300" />
              <span className="text-sm font-medium text-zinc-700">Usuario activo</span>
            </label>

            <div className="md:col-span-2 flex flex-wrap gap-3">
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
