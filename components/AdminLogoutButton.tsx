"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function AdminLogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <button
      onClick={handleLogout}
      className="text-gray-300 hover:text-white text-sm border border-gray-600 px-3 py-1 rounded hover:border-gray-400 transition-colors"
    >
      Abmelden
    </button>
  );
}
