import fs from "fs/promises";
import path from "path";
import { folder } from "../index.js";

export const getFileList = async (req, res) => {
  try {
    // Read directory asynchronously
    const allFiles = await fs.readdir(folder);

    // Filter only PDFs (case-insensitive)
    const pdfFiles = allFiles
      .filter((name) => name.toLowerCase().endsWith(".pdf"))
      .sort((a, b) => a.localeCompare(b, "en", { numeric: true }));

    if (pdfFiles.length === 0) {
      return res.status(200).json({ message: "No PDF files found", files: [] });
    }

    // Auto-generate base URL dynamically
    const baseUrl = `${req.protocol}://${req.get("host")}`;

    // Map files with details
    const files = await Promise.all(
      pdfFiles.map(async (name) => {
        const filePath = path.join(folder, name);
        const stats = await fs.stat(filePath);

        // Convert size to MB with 2 decimals
        const sizeMB = (stats.size / (1024 * 1024)).toFixed(2);

        // Format date to readable string
        const modified = new Date(stats.mtime).toLocaleString("en-GB", {
          year: "numeric",
          month: "short",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
        });

        return {
          name,
          url: `${baseUrl}/wos/file/${encodeURIComponent(name)}`,
          sizeMB,
          modified,
        };
      }),
    );

    res.status(200).json(files);
  } catch (err) {
    console.error("Error reading folder:", err.message);
    res.status(500).json({
      error: "Failed to read files",
      details: err.message,
    });
  }
};
