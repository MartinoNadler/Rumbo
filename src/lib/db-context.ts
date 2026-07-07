import type { Prisma, Role } from "@prisma/client";
import { prisma } from "@/lib/prisma";

/**
 * Runs `fn` inside a transaction with Postgres session variables set so that
 * the RLS policies defined in prisma/rls.sql can identify the current user.
 * The DATABASE_URL used at runtime must point to the restricted "app_user"
 * role (not the table owner) for these policies to actually apply.
 */
export async function withUserContext<T>(
  userId: string,
  role: Role,
  fn: (tx: Prisma.TransactionClient) => Promise<T>
): Promise<T> {
  return prisma.$transaction(async (tx) => {
    await tx.$executeRaw`SELECT set_config('app.current_user_id', ${userId}, true), set_config('app.current_role', ${role}, true)`;
    return fn(tx);
  });
}
