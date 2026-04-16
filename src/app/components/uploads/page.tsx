import { MusicUploadForm } from "@/app/components/uploads/MusicUploadForm";

export default function UploadPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Admin Upload</h1>
      <MusicUploadForm onSuccess={() => {}} />
    </div>
  );
}