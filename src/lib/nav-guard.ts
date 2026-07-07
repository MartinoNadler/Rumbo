import { redirect } from "next/navigation";
import type { Role } from "@prisma/client";
import { DEFAULT_ROUTE } from "@/components/nav/nav-items";

export function requireRole(currentRole: Role, expected: Role) {
  if (currentRole !== expected) {
    redirect(DEFAULT_ROUTE[currentRole]);
  }
}
