import * as kv from "./kv_store.tsx";
import { uploadFileToUnified, deleteFileFromUnified } from "./unified-storage.tsx";

// Initialize storage bucket (handled by unified storage)
export async function initializeMoviesStorage() {
  // Movies storage now uses unified media bucket
  console.log("Movies storage uses unified media bucket");
}

// Upload movie file
export async function uploadMovieFile(
  fileName: string,
  fileData: ArrayBuffer,
  contentType: string
) {
  return uploadFileToUnified(fileName, fileData, contentType, "movies");
}

// Save movie metadata
export async function saveMovieMetadata(movieData: {
  id: string;
  title: string;
  description: string;
  genre: string;
  duration: string;
  releaseYear: string;
  quality: string;
  videoUrl: string;
  fileName: string;
}) {
  await kv.set(`movie:${movieData.id}`, movieData);
}

// Get all movies
export async function getAllMovies() {
  const movies = await kv.getByPrefix("movie:");
  return movies;
}

// Delete movie
export async function deleteMovie(movieId: string, fileName: string) {
  try {
    // Delete from unified storage
    await deleteFileFromUnified(fileName);

    await kv.del(`movie:${movieId}`);
    return { success: true };
  } catch (error) {
    console.error("Error deleting movie:", error);
    throw error;
  }
}
