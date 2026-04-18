import { useAuth } from "./AdminAuth";
import { useState } from "react";
import { Music, Film, Package, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { MusicUploadForm } from "./uploads/MusicUploadForm";
import { MovieUploadForm } from "./uploads/MovieUploadForm";
import { SoftwareUploadForm } from "./uploads/SoftwareUploadForm";

export function AdminUploadPanel() {
  const { isAdmin } = useAuth();
  const [selected, setSelected] = useState<string | null>(null);

  if (!isAdmin) return null;

  return (
    <>
      <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-[100]">
        <button onClick={() => setSelected('music')} className="bg-purple-600 text-white p-4 rounded-full shadow-2xl flex items-center gap-2 font-black uppercase text-[10px]"><Music size={18}/> Music</button>
        <button onClick={() => setSelected('movie')} className="bg-red-600 text-white p-4 rounded-full shadow-2xl flex items-center gap-2 font-black uppercase text-[10px]"><Film size={18}/> Movie</button>
        <button onClick={() => setSelected('soft')} className="bg-orange-600 text-white p-4 rounded-full shadow-2xl flex items-center gap-2 font-black uppercase text-[10px]"><Package size={18}/> Software</button>
      </div>

      <AnimatePresence>
        {selected && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/90">
            <motion.div initial={{ y: 50 }} animate={{ y: 0 }} className="bg-white p-8 rounded-3xl w-full max-w-md">
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-black uppercase tracking-tighter">Admin Upload: {selected}</h2>
                <button onClick={() => setSelected(null)}><X/></button>
              </div>
              {selected === 'music' && <MusicUploadForm onSuccess={() => setSelected(null)} />}
              {selected === 'movie' && <MovieUploadForm onSuccess={() => setSelected(null)} />}
              {selected === 'soft' && <SoftwareUploadForm onSuccess={() => setSelected(null)} />}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}