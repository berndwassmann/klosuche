import { createClient } from "@/lib/supabase/server";
import MapView from "@/components/MapView";
import ToiletList from "@/components/ToiletList";
import SearchBar from "@/components/SearchBar";
import { Toilet } from "@/lib/types";

export default async function HomePage() {
  const supabase = await createClient();
  const { data: toilets } = await supabase
    .from("toilets")
    .select("*")
    .eq("city", "München")
    .order("name");

  return (
    <main className="flex flex-col h-screen">
      <header className="bg-blue-600 text-white px-4 py-3 shadow-md z-10">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-xl font-bold">🚽 KloSuche München</h1>
          <p className="text-blue-100 text-sm">Öffentliche Toiletten auf einen Blick</p>
        </div>
      </header>

      <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
        <aside className="md:w-80 flex flex-col bg-white border-r border-gray-200 md:overflow-y-auto">
          <div className="p-3 border-b border-gray-200">
            <SearchBar />
          </div>
          <div className="flex-1 overflow-y-auto">
            <ToiletList toilets={(toilets as Toilet[]) ?? []} />
          </div>
        </aside>

        <div className="flex-1 relative min-h-64">
          <MapView toilets={(toilets as Toilet[]) ?? []} />
        </div>
      </div>
    </main>
  );
}
