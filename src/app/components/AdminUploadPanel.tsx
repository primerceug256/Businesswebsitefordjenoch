import { useState } from "react";
import { Upload, Music, Film, Package, X } from "lucide-react";
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
      {/* Upload Buttons - Fixed position */}
      <div className="fixed bottom-8 right-8 flex flex-col gap-3 z-40">
        {/* Music Upload */}
        <motion.button
          onClick={() => handleOpenUpload("music")}
          className="bg-purple-600 hover:bg-purple-700 text-white p-4 rounded-full shadow-2xl transition-all flex items-center gap-2"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          title="Upload Music"
        >
          <Music className="w-6 h-6" />
          <span className="hidden sm:inline font-semibold">Music</span>
        </motion.button>

        {/* Movies Upload */}
        <motion.button
          onClick={() => handleOpenUpload("movies")}
          className="bg-red-600 hover:bg-red-700 text-white p-4 rounded-full shadow-2xl transition-all flex items-center gap-2"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          title="Upload Movies"
        >
          <Film className="w-6 h-6" />
          <span className="hidden sm:inline font-semibold">Movies</span>
        </motion.button>

        {/* Software Upload */}
        <motion.button
          onClick={() => handleOpenUpload("software")}
          className="bg-orange-600 hover:bg-orange-700 text-white p-4 rounded-full shadow-2xl transition-all flex items-center gap-2"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          title="Upload Software"
        >
          <Package className="w-6 h-6" />
          <span className="hidden sm:inline font-semibold">Software</span>
        </motion.button>
      </div>

      {/* Login Modal */}
      {showLoginModal && (
        <AdminLoginModal onClose={() => setShowLoginModal(false)} />
      )}

      {/* Upload Modal */}
      <AnimatePresence>
        {isOpen && selectedType && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
              onClick={handleClose}
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed inset-4 sm:inset-auto sm:left-1/2 sm:top-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:w-full sm:max-w-2xl bg-white border border-gray-200 rounded-2xl shadow-2xl z-50 overflow-auto max-h-[90vh]"
            >
              <div className="p-6 sm:p-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-3 rounded-lg ${
                        selectedType === "music"
                          ? "bg-purple-600"
                          : selectedType === "movies"
                          ? "bg-red-600"
                          : "bg-orange-600"
                      }`}
                    >
                      {selectedType === "music" && <Music className="w-6 h-6 text-white" />}
                      {selectedType === "movies" && <Film className="w-6 h-6 text-white" />}
                      {selectedType === "software" && <Package className="w-6 h-6 text-white" />}
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      Upload {selectedType === "music" ? "Music" : selectedType === "movies" ? "Movie" : "Software"}
                    </h2>
                  </div>
                  <button
                    onClick={handleClose}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {/* Upload Form */}
                {selectedType === "music" && <MusicUploadForm onSuccess={handleClose} />}
                {selectedType === "movies" && <MovieUploadForm onSuccess={handleClose} />}
                {selectedType === "software" && <SoftwareUploadForm onSuccess={handleClose} />}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
