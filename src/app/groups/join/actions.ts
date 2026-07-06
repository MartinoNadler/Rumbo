"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { joinGroupByCode } from "@/lib/groups";

export type JoinGroupState = { error?: string } | undefined;

export async function joinGroupAction(
  _prevState: JoinGroupState,
  formData: FormData
): Promise<JoinGroupState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const code = formData.get("code") as string;
  const result = await joinGroupByCode(user.id, code);

  if (!result.ok) {
    return { error: result.error };
  }

  redirect("/dashboard");
}
