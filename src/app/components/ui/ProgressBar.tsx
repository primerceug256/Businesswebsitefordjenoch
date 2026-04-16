export default function ProgressBar({ progress }: { progress: number }) {
  return (
    <div className="w-full bg-gray-300 rounded h-3">
      <div
        className="bg-purple-600 h-3 rounded"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}