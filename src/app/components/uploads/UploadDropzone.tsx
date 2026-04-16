"use client";

import { useState } from "react";

export default function UploadDropzone({ onFile }: any) {
  const [dragging, setDragging] = useState(false);

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragging(false);
        const file = e.dataTransfer.files[0];
        onFile(file);
      }}
      className={`p-10 border-2 border-dashed rounded-lg text-center ${
        dragging ? "bg-purple-100 border-purple-500" : "bg-gray-100"
      }`}
    >
      Drag & Drop File Here
    </div>
  );
}