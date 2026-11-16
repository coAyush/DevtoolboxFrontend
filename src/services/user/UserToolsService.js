import { usePrivateApi } from "../../api/axiosInstance";

/**
 * Service to fetch all available tool categories for the authenticated user.
 * Backend Endpoint: GET /api/users/tools-suite
 * Returns category list with toolId and toolCategory.
 */
export const getToolsSuite = async () => {
    try {
        const response = await usePrivateApi.get("/users/tools-suite");
        // Response format is { code, message, status, data: [...] }
        return response;
    } catch (error) {
        console.error("Failed to fetch tools suite:", error);
        throw error;
    }
};

/**
 * Service to fetch sub-tools inside a specific category.
 * Backend Endpoint: GET /api/users/sub-tools-suite?toolId={toolId}
 * @param {number|string} toolId - ID of the category (e.g., 1: Image, 2: Productivity, 3: PDF)
 */
export const getSubToolsSuite = async (toolId) => {
    try {
        const response = await usePrivateApi.get(`/users/sub-tools-suite?toolId=${toolId}`);
        return response;
    } catch (error) {
        console.error(`Failed to fetch sub-tools for category ${toolId}:`, error);
        throw error;
    }
};

/**
 * Service to generate QR Code.
 * Backend Endpoint: POST /api/users/tools/qr-code
 * @param {Object} payload - { toolId, toolSubId, url, width, height }
 */
export const generateQrCodeApi = async ({ toolId = 2, toolSubId = 1, url, width = 300, height = 300 }) => {
    try {
        const response = await usePrivateApi.post("/users/tools/qr-code", {
            toolId: Number(toolId),
            toolSubId: Number(toolSubId),
            url: url.trim(),
            width: Number(width),
            height: Number(height),
        });
        return response;
    } catch (error) {
        console.error("Failed to generate QR code:", error);
        throw error;
    }
};

/**
 * Service to compress a PDF.
 * Backend Endpoint: POST /api/users/tools/pdf-compressor
 * Accepts multipart/form-data: file, toolId, subToolId, compressionLevel (LOW, MEDIUM, HIGH)
 * Returns a binary PDF Blob.
 */
export const compressPdfApi = async ({ file, toolId = 3, subToolId = 3, compressionLevel = "MEDIUM" }) => {
    try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("toolId", toolId);
        formData.append("subToolId", subToolId);
        formData.append("compressionLevel", compressionLevel);

        const response = await usePrivateApi.post("/users/tools/pdf-compressor", formData, {
            responseType: "blob",
            timeout: 60000, // 60s for larger file compression
        });
        return response;
    } catch (error) {
        console.error("Failed to compress PDF:", error);
        throw error;
    }
};

/**
 * Service to convert images into a single PDF.
 * Backend Endpoint: POST /api/users/tools/image-to-pdf
 * Accepts multipart/form-data: files (up to 20), toolId, subToolId, pageMode (FIT_IMAGE, A4)
 * Returns a binary PDF Blob.
 */
export const imageToPdfApi = async ({ files, toolId = 3, subToolId = 5, pageMode = "FIT_IMAGE" }) => {
    try {
        const formData = new FormData();
        files.forEach((file) => {
            formData.append("files", file);
        });
        formData.append("toolId", toolId);
        formData.append("subToolId", subToolId);
        formData.append("pageMode", pageMode);

        const response = await usePrivateApi.post("/users/tools/image-to-pdf", formData, {
            responseType: "blob",
            timeout: 60000,
        });
        return response;
    } catch (error) {
        console.error("Failed to convert image to PDF:", error);
        throw error;
    }
};

/**
 * Service to convert Word document (.docx) to PDF.
 * Backend Endpoint: POST /api/users/tools/word-to-pdf
 * Accepts multipart/form-data: file, toolId, subToolId
 * Returns a binary PDF Blob.
 */
export const wordToPdfApi = async ({ file, toolId = 3, subToolId = 4 }) => {
    try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("toolId", toolId);
        formData.append("subToolId", subToolId);

        const response = await usePrivateApi.post("/users/tools/word-to-pdf", formData, {
            responseType: "blob",
            timeout: 60000,
        });
        return response;
    } catch (error) {
        console.error("Failed to convert Word to PDF:", error);
        throw error;
    }
};

/**
 * Service to merge multiple PDF files.
 * Backend Endpoint: POST /api/users/tools
 * Accepts multipart/form-data: files (2 to 20), toolId, subToolId
 * Returns a binary PDF Blob.
 */
export const mergePdfApi = async ({ files, toolId = 3, subToolId = 1 }) => {
    try {
        const formData = new FormData();
        files.forEach((file) => {
            formData.append("files", file);
        });
        formData.append("toolId", toolId);
        formData.append("subToolId", subToolId);

        const response = await usePrivateApi.post("/users/tools", formData, {
            responseType: "blob",
            timeout: 60000,
        });
        return response;
    } catch (error) {
        console.error("Failed to merge PDFs:", error);
        throw error;
    }
};
