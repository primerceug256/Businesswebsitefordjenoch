"use client";

import { useState } from "react";
import { Upload, Music, Loader, CheckCircle } from "lucide-react";
import { motion } from "motion/react";
import { supabase } from "@/utils/supabase/info";

const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB (realistic)

export function MusicUploadForm({ onSuccess }: { onSuccess: () => void }) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("DJ ENOCH PRO");
  const [genre, setGenre] = useState("Mix");
  const [duration, setDuration] = useState("");
  const [releaseDate, setReleaseDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (file.size > MAX_FILE_SIZE) {
      setError("File too large (max 100MB)");
      return;
    }

    if (!file.type.startsWith("audio/")) {
      setError("Only audio files allowed");
      return;
    }

    setSelectedFile(file);
    setError(null);

    if (!title) {
      setTitle(file.name.replace(/\.[^/.]+$/, ""));
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedFile) {
      setError("Select a file first");
      return;
    }

    setUploading(true);
    setError(null);
    setUploadProgress(10);

    const filePath = `tracks/${Date.now()}-${selectedFile.name}`;

    try {
      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from("music")
        .upload(filePath, selectedFile);

      if (uploadError) throw uploadError;

      setUploadProgress(70);

      // Get public URL
      const { data } = supabase.storage
        .from("music")
        .getPublicUrl(filePath);

      setUploadProgress(85);

      // Save to database
      const { error: dbError } = await supabase.from("music").insert([
        {
          title,
          artist,
          genre,
          duration,
          release_date: releaseDate,
          file_url: data.publicUrl,
        },
      ]);

      if (dbError) throw dbError;