"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { clearAdminSessionCookie } from "@/lib/session";
import { logoutAdmin } from "@/lib/api";

const navItems = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/usuarios", label: "Usuarios" },
  { href: "/pedidos", label: "Pedidos" },
  { href: "/cotizaciones", label: "Cotizaciones" },
  { href: "/productos", label: "Productos" },
  { href: "/carousel", label: "Carousel" },
] as const;

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logoutAdmin();
    } catch {
      // Si el backend ya expiró la sesión, igual limpiamos el estado local.
    } finally {
      clearAdminSessionCookie();
      router.replace("/login");
      router.refresh();
    }
  };

  const closeMobileNav = () => setMobileNavOpen(false);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <div className="flex min-h-screen">
        <aside className="hidden w-64 flex-col border-r border-gray-200 bg-white shadow-lg md:flex">
          <div className="border-b border-gray-200 p-4 text-xl font-bold">
            <Link href="/dashboard">
            <Image
              src="/siscadindustrial-recortado.svg"
              alt="SISCAD"
              width={170}
              height={48}
              priority
              className="h-auto w-40"
            />
            </Link>
          </div>

          <nav className="p-4 space-y-2">
            {navItems.map((item) => {
              const active = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`block rounded hover:bg-gray-100 px-4 py-2 text-gray-700 text-sm font-medium transition ${
                    active
                      ? "bg-gray-950 text-white shadow-sm"
                      : ""
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <button
            type="button"
            onClick={handleLogout}
            className="mt-auto rounded border border-gray-200 px-4 py-2 text-left text-sm font-medium text-red-600 transition hover:bg-red-100"
          >
            Cerrar sesión
          </button>
        </aside>

        <div className="flex min-h-screen flex-1 flex-col">
          <header className="sticky top-0 z-20 border-b border-gray-200 bg-white/95 backdrop-blur">
            <div className="flex items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
              <div className="flex items-center gap-3 md:hidden">
                <button
                  type="button"
                  onClick={() => setMobileNavOpen((current) => !current)}
                  className="rounded border border-gray-300 p-2 text-gray-700"
                  aria-label="Abrir navegación"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
                <Image src="/siscadindustrial-recortado.svg" alt="SISCAD" width={130} height={36} className="h-auto w-32" />
              </div>

              <div className="hidden md:block">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gray-500">Panel administrativo</p>
                <h1 className="text-lg font-semibold text-gray-950">SISCAD</h1>
              </div>

              <button
                type="button"
                onClick={handleLogout}
                className="rounded border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-red-100 hover:text-red-700"
              >
                Salir
              </button>
            </div>
          </header>

          {mobileNavOpen ? (
            <div className="fixed inset-0 z-30 bg-black/30 md:hidden" onClick={closeMobileNav}>
              <aside
                className="h-full w-72 bg-white p-4 shadow-2xl"
                onClick={(event) => event.stopPropagation()}
              >
                <div className="border-b border-gray-200 pb-4">
                  <Image src="/siscadindustrial-recortado.svg" alt="SISCAD" width={160} height={44} className="h-auto w-40" />
                </div>
                <nav className="space-y-2 py-4">
                  {navItems.map((item) => {
                    const active = pathname.startsWith(item.href);
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={closeMobileNav}
                        className={`block rounded px-4 py-2 text-sm font-medium transition ${
                          active ? "bg-gray-950 text-white" : "text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        {item.label}
                      </Link>
                    );
                  })}
                </nav>
              </aside>
            </div>
          ) : null}

          <main className="flex-1 px-4 py-6 sm:px-6 lg:px-10">{children}</main>
        </div>
      </div>
    </div>
  );
}
