/**
 * Utility helper for file downloads and size formatting.
 */

/**
 * Trigger a browser file download from a Blob object.
 * @param {Blob} blob - The Blob data to download
 * @param {string} fileName - Suggested file name
 */
export const downloadBlob = (blob, fileName = "download.pdf") => {
    if (!blob) return;
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link);
    window.URL.revokeObjectURL(url);
};

/**
 * Trigger download from a remote URL (like Cloudinary image).
 * @param {string} url - Remote resource URL
 * @param {string} filename - Suggested file name
 */
export const downloadFromUrl = async (url, filename = "qr-code.png") => {
    try {
        const response = await fetch(url);
        const blob = await response.blob();
        downloadBlob(blob, filename);
    } catch {
        // Fallback: open in new window
        window.open(url, "_blank");
    }
};

/**
 * Format bytes to human readable format (KB, MB, GB).
 * @param {number} bytes 
 * @param {number} decimals 
 */
export const formatBytes = (bytes, decimals = 2) => {
    if (!bytes || bytes === 0) return "0 Bytes";
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
};
