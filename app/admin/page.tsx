import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Toilet } from "@/lib/types";
import AdminLogoutButton from "@/components/AdminLogoutButton";

export default async function AdminPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/admin/login");

  const { data: toilets } = await supabase
    .from("toilets")
    .select("*")
    .order("city")
    .order("name");

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-gray-900 text-white px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold">KloSuche Admin</h1>
            <p className="text-gray-400 text-xs">{user.email}</p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="text-gray-300 hover:text-white text-sm"
            >
              Zur Website →
            </Link>
            <AdminLogoutButton />
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">
            Toiletten ({toilets?.length ?? 0})
          </h2>
          <Link
            href="/admin/neu"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            + Neu anlegen
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {!toilets || toilets.length === 0 ? (
            <div className="p-8 text-center text-gray-400">
              Noch keine Einträge vorhanden.{" "}
              <Link href="/admin/neu" className="text-blue-600 underline">
                Ersten Eintrag anlegen
              </Link>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Name</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600 hidden sm:table-cell">Adresse</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600 hidden md:table-cell">Stadt</th>
                  <th className="text-right px-4 py-3 font-medium text-gray-600">Aktionen</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {(toilets as Toilet[]).map((t) => (
                  <tr key={t.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">{t.name}</td>
                    <td className="px-4 py-3 text-gray-500 hidden sm:table-cell">{t.address}</td>
                    <td className="px-4 py-3 text-gray-500 hidden md:table-cell">{t.city}</td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        href={`/admin/${t.id}`}
                        className="text-blue-600 hover:underline mr-3"
                      >
                        Bearbeiten
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
