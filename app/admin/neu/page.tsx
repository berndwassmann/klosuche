import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import ToiletForm from "@/components/ToiletForm";

export default async function AdminNewPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-gray-900 text-white px-4 py-3">
        <div className="max-w-2xl mx-auto">
          <Link href="/admin" className="text-gray-400 hover:text-white text-sm">
            ← Zurück zur Übersicht
          </Link>
        </div>
      </header>

      <div className="max-w-2xl mx-auto p-4">
        <h1 className="text-xl font-bold text-gray-900 mb-6">Neue Toilette anlegen</h1>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <ToiletForm />
        </div>
      </div>
    </div>
  );
}
