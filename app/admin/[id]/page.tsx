import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import ToiletForm from "@/components/ToiletForm";
import { Toilet } from "@/lib/types";

export default async function AdminEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const { data: toilet } = await supabase
    .from("toilets")
    .select("*")
    .eq("id", id)
    .single();

  if (!toilet) notFound();

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
        <h1 className="text-xl font-bold text-gray-900 mb-6">
          Bearbeiten: {(toilet as Toilet).name}
        </h1>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <ToiletForm toilet={toilet as Toilet} />
        </div>
      </div>
    </div>
  );
}
