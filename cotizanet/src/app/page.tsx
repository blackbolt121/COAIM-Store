import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_SESSION_COOKIE } from "@/app/lib/session";

export default async function Home() {
  const cookieStore = await cookies();
  const hasSession = cookieStore.get(ADMIN_SESSION_COOKIE)?.value === "1";
  redirect(hasSession ? "/cotizaciones" : "/login");
}
