// src/app/components/uploads/MusicUploadForm.tsx
// Update the handleUpload function's FormData part:

const handleUpload = async (e: React.FormEvent) => {
    // ... logic
    const formDataToSend = new FormData();
    formDataToSend.append("file", selectedFile);
    formDataToSend.append("title", formData.title);
    formDataToSend.append("type", formData.genre); // CHANGE THIS: backend expects 'type'
    formDataToSend.append("duration", formData.duration);
    formDataToSend.append("releaseDate", formData.releaseDate);
    // ... xhr logic
}