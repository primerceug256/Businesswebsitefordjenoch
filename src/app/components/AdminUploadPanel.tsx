import { useState } from "react";
import { Music, Film, Package, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useAuth } from "../context/AuthContext";
import { MusicUploadForm } from "./uploads/MusicUploadForm";
import { MovieUploadForm } from "./uploads/MovieUploadForm";
import { SoftwareUploadForm } from "./uploads/SoftwareUploadForm";

export function AdminUploadPanel() {
  const { isAdmin } = useAuth(); // Checks your email
  const [isOpen, setIsOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<string | null>(null);

  // If not you, don't show the buttons at all
  if (!isAdmin) return null;

  const handleOpenUpload = (type: string) => {
    setSelectedType(type);
    setIsOpen(true);
  };

  return (
    <>
      <div className="fixed bottom-8 right-8 flex flex-col gap-3 z-40">
        <button onClick={() => handleOpenUpload("music")} className="bg-purple-600 text-white p-4 rounded-full shadow-2xl flex items-center gap-2 font-bold"><Music /> Music</button>
        <button onClick={() => handleOpenUpload("movies")} className="bg-red-600 text-white p-4 rounded-full shadow-2xl flex items-center gap-2 font-bold"><Film /> Movies</button>
        <button onClick={() => handleOpenUpload("software")} className="bg-orange-600 text-white p-4 rounded-full shadow-2xl flex items-center gap-2 font-bold"><Package /> Software</button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{opacity:0}} animate={{opacity:1}} className="absolute inset-0 bg-black/80" onClick={() => setIsOpen(false)} />
            <motion.div initial={{y:50}} animate={{y:0}} className="relative w-full max-w-2xl bg-white text-black rounded-2xl p-8 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold uppercase">Upload {selectedType}</h2>
                <button onClick={() => setIsOpen(false)}><X size={30}/></button>
              </div>
              {selectedType === "music" && <MusicUploadForm onSuccess={() => setIsOpen(false)} />}
              {selectedType === "movies" && <MovieUploadForm onSuccess={() => setIsOpen(false)} />}
              {selectedType === "software" && <SoftwareUploadForm onSuccess={() => setIsOpen(false)} />}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}