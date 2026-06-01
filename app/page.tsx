import { createClient } from "@/lib/supabase/server";
import ToiletExplorer from "@/components/ToiletExplorer";
import { Toilet } from "@/lib/types";

export default async function HomePage() {
  const supabase = await createClient();
  const { data: toilets } = await supabase
    .from("toilets")
    .select("*")
    .eq("city", "München")
    .order("name");

  return (
    <main className="flex flex-col flex-1 overflow-hidden bg-gray-50">
      <div className="px-4 py-2 bg-white border-b border-gray-100 flex items-center justify-between">
        <p className="text-xs text-gray-400">Öffentliche Toiletten auf einen Blick</p>
        <span className="text-xs bg-blue-50 text-blue-600 px-2.5 py-1 rounded-full font-medium">
          {(toilets ?? []).length} Standorte
        </span>
      </div>
      <ToiletExplorer toilets={(toilets as Toilet[]) ?? []} />
    </main>
  );
}
