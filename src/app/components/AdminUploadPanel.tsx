import { useState } from "react";
import { Music, Film, Package, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useAdmin, AdminLoginModal } from "./AdminAuth";
import { MusicUploadForm } from "./uploads/MusicUploadForm";
import { MovieUploadForm } from "./uploads/MovieUploadForm";
import { SoftwareUploadForm } from "./uploads/SoftwareUploadForm";

type ContentType = "music" | "movies" | "software";

export function AdminUploadPanel() {
  const { isAuthenticated } = useAdmin();
  const [isOpen, setIsOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [selectedType, setSelectedType] = useState<ContentType | null>(null);

  const handleOpenUpload = (type: ContentType) => {
    if (!isAuthenticated) {
      setShowLoginModal(true);
      return;
    }
    setSelectedType(type);
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    setSelectedType(null);
  };

  return (
    <>
      <div className="fixed bottom-8 right-8 flex flex-col gap-3 z-40">
        <button onClick={() => handleOpenUpload("music")} className="bg-purple-600 text-white p-4 rounded-full shadow-lg flex items-center gap-2">
          <Music className="w-6 h-6" /> <span className="hidden sm:inline font-bold">Upload Music</span>
        </button>
        <button onClick={() => handleOpenUpload("movies")} className="bg-red-600 text-white p-4 rounded-full shadow-lg flex items-center gap-2">
          <Film className="w-6 h-6" /> <span className="hidden sm:inline font-bold">Upload Movie</span>
        </button>
        <button onClick={() => handleOpenUpload("software")} className="bg-orange-600 text-white p-4 rounded-full shadow-lg flex items-center gap-2">
          <Package className="w-6 h-6" /> <span className="hidden sm:inline font-bold">Upload Software</span>
        </button>
      </div>

      {showLoginModal && <AdminLoginModal onClose={() => setShowLoginModal(false)} />}

      <AnimatePresence>
        {isOpen && selectedType && (
          <>
            <div className="fixed inset-0 bg-black/80 z-50" onClick={handleClose} />
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="fixed inset-4 sm:left-1/2 sm:top-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:w-full sm:max-w-md bg-white rounded-2xl shadow-2xl z-50 p-6 h-fit overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Upload {selectedType}</h2>
                <button onClick={handleClose}><X /></button>
              </div>
              {selectedType === "music" && <MusicUploadForm onSuccess={handleClose} />}
              {selectedType === "movies" && <MovieUploadForm onSuccess={handleClose} />}
              {selectedType === "software" && <SoftwareUploadForm onSuccess={handleClose} />}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}