import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { ROLE_ADMIN, auth, type SessionUser } from "./auth";

export async function currentUser(): Promise<SessionUser | null> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) return null;
  const u = session.user as unknown as SessionUser;
  return { id: u.id, email: u.email, name: u.name, role: u.role ?? "teacher" };
}

export async function requireUser(): Promise<SessionUser> {
  const user = await currentUser();
  if (!user) redirect("/dang-nhap");
  return user;
}

export async function requireAdmin(): Promise<SessionUser> {
  const user = await requireUser();
  if (user.role !== ROLE_ADMIN) redirect("/");
  return user;
}

export function isAdmin(user: SessionUser): boolean {
  return user.role === ROLE_ADMIN;
}
