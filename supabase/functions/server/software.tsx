import * as kv from "./kv_store.tsx";
import { uploadFileToUnified, deleteFileFromUnified } from "./unified-storage.tsx";

// Initialize storage bucket (handled by unified storage)
export async function initializeSoftwareStorage() {
  // Software storage now uses unified media bucket
  console.log("Software storage uses unified media bucket");
}

// Upload software file
export async function uploadSoftwareFile(
  fileName: string,
  fileData: ArrayBuffer,
  contentType: string
) {
  return uploadFileToUnified(fileName, fileData, contentType, "software");
}

// Save software metadata
export async function saveSoftwareMetadata(softwareData: {
  id: string;
  title: string;
  description: string;
  version: string;
  platform: string;
  category: string;
  price: string;
  downloadUrl: string;
  fileName: string;
}) {
  await kv.set(`software:${softwareData.id}`, softwareData);
}

// Get all software
export async function getAllSoftware() {
  const software = await kv.getByPrefix("software:");
  return software;
}

// Delete software
export async function deleteSoftware(softwareId: string, fileName: string) {
  try {
    // Delete from unified storage
    await deleteFileFromUnified(fileName);

    await kv.del(`software:${softwareId}`);
    return { success: true };
  } catch (error) {
    console.error("Error deleting software:", error);
    throw error;
  }
}
