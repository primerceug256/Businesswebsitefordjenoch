// src/app/components/FreeDownloads.tsx
// ... existing imports
export function FreeDownloads({ searchQuery = "" }: { searchQuery?: string }) {
  const [tracks, setTracks] = useState<MusicTrack[]>([]);
  // ... existing states

  const filteredTracks = tracks.filter(track => 
    track.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    track.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <section id="downloads" className="py-20 bg-white">
      {/* ... header ... */}
      {!loading && !error && filteredTracks.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTracks.map((track, index) => (
            <TrackCard key={track.id} track={track} index={index} />
          ))}
        </div>
      )}
      {/* ... empty state ... */}
    </section>
  );
}