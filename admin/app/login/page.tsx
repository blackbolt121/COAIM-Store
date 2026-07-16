"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import siscadLogo from "@/public/siscadindustrial-recortado.svg";
import { getCurrentUser, loginAdmin, logoutAdmin } from "@/lib/api";
import { setAdminSessionCookie } from "@/lib/session";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await loginAdmin(email, password);
      const profile = await getCurrentUser();
      const roles = profile.roles ?? [];

      if (!roles.some((role) => role.name === "ROLE_ADMIN" || role.name === "ROLE_SALES")) {
        await logoutAdmin().catch(() => undefined);
        setError("Tu cuenta no tiene acceso a Cotizanet. Usa una cuenta con rol ROLE_ADMIN o ROLE_SALES.");
        return;
      }

      setAdminSessionCookie();
      router.replace("/dashboard");
      router.refresh();
    } catch (loginError) {
      const message = loginError instanceof Error ? loginError.message : "No se pudo iniciar sesión.";
      setError(
          message.includes("401") || message.includes("403")
            ? "Credenciales inválidas o cuenta sin acceso a Cotizanet."
            : message,
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,rgba(24,24,27,0.08),transparent_38%),linear-gradient(180deg,#fafafa_0%,#f4f4f5_100%)] px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-3xl border border-zinc-200 bg-white p-8 shadow-xl shadow-zinc-200/60"
      >
        <div className="mb-8 flex justify-center">
          <div className="rounded-2xl px-5 py-4">
            <Image src={siscadLogo} alt="SISCAD" priority className="h-10 w-auto" />
          </div>
        </div>

        <div className="space-y-2 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-zinc-500">Acceso administrativo</p>
          <h1 className="text-2xl font-semibold text-zinc-950">Iniciar sesión</h1>
          <p className="text-sm text-zinc-500">Panel operativo para usuarios de ventas y administradores.</p>
        </div>

        <div className="mt-8 space-y-5">
          <label className="block space-y-2">
            <span className="text-sm font-medium text-zinc-700">Correo electrónico</span>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              className="w-full rounded-xl border border-zinc-300 px-4 py-3 outline-none transition focus:border-zinc-950 focus:ring-2 focus:ring-zinc-950/10"
              placeholder="admin@siscad.com"
            />
          </label>

          <label className="block space-y-2">
            <span className="text-sm font-medium text-zinc-700">Contraseña</span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              className="w-full rounded-xl border border-zinc-300 px-4 py-3 outline-none transition focus:border-zinc-950 focus:ring-2 focus:ring-zinc-950/10"
              placeholder="••••••••"
            />
          </label>

          {error ? (
            <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
          ) : null}

          <button
            type="submit"
            disabled={loading}
            className="inline-flex w-full items-center justify-center rounded-xl bg-zinc-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Validando..." : "Entrar"}
          </button>
        </div>
      </form>
    </main>
  );
}
