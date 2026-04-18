import * as kv from "./kv_store.tsx";
import { uploadFileToUnified, deleteFileFromUnified } from "./unified-storage.tsx";

// Initialize storage bucket (handled by unified storage)
export async function initializeMusicStorage() {
  // Music storage now uses unified bucket
  console.log("Music storage uses unified media bucket");
}

// Upload music file
export async function uploadMusicFile(
  fileName: string,
  fileData: ArrayBuffer,
  contentType: string
) {
  return uploadFileToUnified(fileName, fileData, contentType, "music");
}

// Save track metadata to KV store
export async function saveTrackMetadata(trackData: {
  id: string;
  title: string;
  type: string;
  duration: string;
  releaseDate: string;
  audioUrl: string;
  fileName: string;
}) {
  await kv.set(`track:${trackData.id}`, trackData);
}

// Get all tracks
export async function getAllTracks() {
  const tracks = await kv.getByPrefix("track:");
  return tracks;
}

// Delete track
export async function deleteTrack(trackId: string, fileName: string) {
  try {
    // Delete from unified storage
    await deleteFileFromUnified(fileName);

    // Delete metadata
    await kv.del(`track:${trackId}`);

    return { success: true };
  } catch (error) {
    console.error("Error deleting track:", error);
    throw error;
  }
}