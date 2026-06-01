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
    <main className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-3 z-10 shadow-sm">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="bg-blue-600 text-white rounded-xl w-9 h-9 flex items-center justify-center text-lg font-bold shadow-sm">
              🚽
            </div>
            <div>
              <h1 className="text-base font-bold text-gray-900 leading-tight">KloSuche München</h1>
              <p className="text-xs text-gray-400">Öffentliche Toiletten auf einen Blick</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs bg-blue-50 text-blue-600 px-2.5 py-1 rounded-full font-medium">
              {(toilets ?? []).length} Standorte
            </span>
          </div>
        </div>
      </header>

      <ToiletExplorer toilets={(toilets as Toilet[]) ?? []} />
    </main>
  );
}
