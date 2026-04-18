import { motion } from "motion/react";
import { Package, Download, Monitor, Loader } from "lucide-react";
import { useState, useEffect } from "react";
import { projectId, publicAnonKey } from "/utils/supabase/info";

interface Software {
  id: string;
  title: string;
  description: string;
  version: string;
  platform: string;
  category: string;
  price: string;
  downloadUrl: string;
  fileName: string;
}

function SoftwareCard({ software, index }: { software: Software; index: number }) {
  const handleDownload = () => {
    if (software.downloadUrl) {
      const link = document.createElement("a");
      link.href = software.downloadUrl;
      link.download = software.title;
      link.click();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-xl transition-all group"
    >
      {/* Software Header */}
      <div className="p-6 bg-gradient-to-r from-orange-50 to-red-50">
        <div className="flex items-center justify-between mb-4">
          <div className="bg-orange-600 p-3 rounded-lg">
            <Package className="w-6 h-6 text-white" />
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-orange-600 text-white">
            v{software.version}
          </span>
        </div>
        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">{software.title}</h3>
        <p className="text-sm text-gray-600 line-clamp-2">{software.description || "No description available"}</p>
      </div>

      {/* Software Details */}
      <div className="p-6">
        <div className="space-y-3 mb-6">
          <div className="flex items-center gap-2 text-gray-600">
            <Monitor className="w-4 h-4 text-orange-500" />
            <span className="text-sm">{software.platform}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <Package className="w-4 h-4" />
            <span className="text-sm">{software.category}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-orange-600">
              {parseInt(software.price) > 0 ? `${parseInt(software.price).toLocaleString()} UGX` : "FREE"}
            </span>
          </div>
        </div>

        {/* Download Button */}
        <button
          onClick={handleDownload}
          className="w-full bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg font-bold transition-all transform hover:scale-105 flex items-center justify-center gap-2"
        >
          <Download className="w-4 h-4" />
          Download Now
        </button>
      </div>
    </motion.div>
  );
}

export function SoftwareSection() {
  const [software, setSoftware] = useState<Software[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSoftware();
  }, []);

  const fetchSoftware = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-98d801c7/software/list`,
        {
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch software");
      }

      const data = await response.json();
      setSoftware(data.software || []);
    } catch (err) {
      console.error("Error fetching software:", err);
      setError(err instanceof Error ? err.message : "Failed to load software");
    } finally {
      setLoading(false);
    }
  };

  if (software.length === 0 && !loading && !error) {
    return null; // Don't show section if no software
  }

  return (
    <section id="software" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            DJ Software & Tools
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-orange-500 to-red-500 mx-auto mb-6"></div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Download professional DJ software and tools to elevate your mixing!
          </p>
        </motion.div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-16">
            <Loader className="w-12 h-12 text-orange-600 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading software...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
            <p className="text-red-600 text-center">{error}</p>
          </div>
        )}

        {/* Software Grid */}
        {!loading && !error && software.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {software.map((item, index) => (
              <SoftwareCard key={item.id} software={item} index={index} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
