export const ADMIN_SESSION_COOKIE = "cotizanet_admin_session";

const ONE_DAY = 60 * 60 * 24;

export function setAdminSessionCookie() {
  if (typeof document === "undefined") return;
  document.cookie = `${ADMIN_SESSION_COOKIE}=1; path=/; max-age=${ONE_DAY}; samesite=lax`;
}

export function clearAdminSessionCookie() {
  if (typeof document === "undefined") return;
  document.cookie = `${ADMIN_SESSION_COOKIE}=; path=/; max-age=0; samesite=lax`;
}

export function hasAdminSessionCookie(cookieHeader?: string) {
  const source = cookieHeader ?? (typeof document !== "undefined" ? document.cookie : "");
  return source.split(";").some((part) => part.trim().startsWith(`${ADMIN_SESSION_COOKIE}=`));
}
