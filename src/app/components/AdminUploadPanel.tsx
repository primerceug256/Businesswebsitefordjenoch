// src/app/components/AdminUploadPanel.tsx
import { useAuth } from "./AdminAuth";
// ... other imports

export function AdminUploadPanel() {
  const { isAdmin } = useAuth(); // Using the new admin check

  // If NOT primerceug@gmail.com, return nothing (Hide buttons completely)
  if (!isAdmin) return null;

  return (
    <div className="fixed bottom-8 right-8 flex flex-col gap-3 z-40">
      {/* ... Music/Movie/Software Upload Buttons ... */}
    </div>
  );
}