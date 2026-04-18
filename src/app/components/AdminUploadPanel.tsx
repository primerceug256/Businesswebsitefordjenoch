import { useAuth } from "./AdminAuth";
import { useState } from "react";
import { Music, Film, Package, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { MusicUploadForm } from "./uploads/MusicUploadForm";
import { MovieUploadForm } from "./uploads/MovieUploadForm";
import { SoftwareUploadForm } from "./uploads/SoftwareUploadForm";

export function AdminUploadPanel() {
  const { isAdmin, user } = useAuth();
  const [selected, setSelected] = useState<string | null>(null);

  // LOG FOR DEBUGGING - You can see this in the browser console
  if (user) {
    console.log("Logged in as:", user.email, "Is Admin:", isAdmin);
  }

  if (!isAdmin) return null;

  return (
    <>
      {/* Floating Admin Buttons */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-[100]">
        <button onClick={() => setSelected('music')} className="bg-purple-600 text-white w-14 h-14 rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-all border-4 border-white">
          <Music size={24}/>
        </button>
        <button onClick={() => setSelected('movie')} className="bg-red-600 text-white w-14 h-14 rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-all border-4 border-white">
          <Film size={24}/>
        </button>
        <button onClick={() => setSelected('soft')} className="bg-orange-600 text-white w-14 h-14 rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-all border-4 border-white">
          <Package size={24}/>
        </button>
      </div>

      <AnimatePresence>
        {selected && (
          <div className="fixed inset-0 z-[600] flex items-center justify-center p-4 bg-black/90">
            <motion.div initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="bg-white p-8 rounded-[40px] w-full max-w-md shadow-2xl">
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-black uppercase italic tracking-tighter">Admin Upload: {selected}</h2>
                <button onClick={() => setSelected(null)} className="bg-gray-100 p-2 rounded-full"><X size={20}/></button>
              </div>
              
              <div className="max-h-[60vh] overflow-y-auto pr-2">
                {selected === 'music' && <MusicUploadForm onSuccess={() => setSelected(null)} />}
                {selected === 'movie' && <MovieUploadForm onSuccess={() => setSelected(null)} />}
                {selected === 'soft' && <SoftwareUploadForm onSuccess={() => setSelected(null)} />}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}