import {
    QrCode,
    FileArchive,
    Images,
    FileSpreadsheet,
    FileStack,
    FileText,
    Zap,
    Image as ImageIcon,
    Sliders,
    Sparkles,
    Hash,
    AlignLeft
} from "lucide-react";

/**
 * Metadata definition for all tool categories.
 * Contains icons, styling gradients, and default descriptions.
 */
export const CATEGORY_METADATA = {
    1: {
        id: 1,
        title: "Image Tools",
        description: "Optimize, transform and convert image formats effortlessly.",
        icon: ImageIcon,
        gradient: "from-pink-500/20 via-purple-500/20 to-indigo-500/20",
        borderAccent: "hover:border-pink-500/50",
        glowColor: "rgba(236, 72, 153, 0.15)",
        badge: "Image Suite",
    },
    2: {
        id: 2,
        title: "Productivity Tools",
        description: "Essential utilities to accelerate your daily workflow and tasks.",
        icon: Zap,
        gradient: "from-cyan-500/20 via-blue-500/20 to-indigo-500/20",
        borderAccent: "hover:border-cyan-500/50",
        glowColor: "rgba(6, 182, 212, 0.15)",
        badge: "Productivity",
    },
    3: {
        id: 3,
        title: "PDF Tools",
        description: "Compress, merge, convert, and manage PDF documents securely.",
        icon: FileText,
        gradient: "from-indigo-500/20 via-cyan-500/20 to-teal-500/20",
        borderAccent: "hover:border-indigo-500/50",
        glowColor: "rgba(99, 102, 241, 0.15)",
        badge: "Document Suite",
    },
};

/**
 * Catalog of known sub-tools with their endpoints and configurations.
 * Allows easy extension for future tools!
 */
export const TOOLS_CATALOG = {
    "qr-code": {
        slug: "qr-code",
        name: "QR Code Generator",
        categoryId: 2,
        categoryName: "Productivity Tools",
        toolId: 2,
        subToolId: 1,
        icon: QrCode,
        badge: "Live Endpoint",
        description: "Generate high-resolution, scannable QR codes for links, text, and data.",
        isAvailable: true,
        endpoint: "/api/users/tools/qr-code",
    },
    "pdf-compressor": {
        slug: "pdf-compressor",
        name: "PDF Compressor",
        categoryId: 3,
        categoryName: "PDF Tools",
        toolId: 3,
        subToolId: 3,
        icon: FileArchive,
        badge: "Live Endpoint",
        description: "Reduce PDF document file size with Low, Medium, and High compression modes.",
        isAvailable: true,
        endpoint: "/api/users/tools/pdf-compressor",
    },
    "image-to-pdf": {
        slug: "image-to-pdf",
        name: "Image to PDF",
        categoryId: 3,
        categoryName: "PDF Tools",
        toolId: 3,
        subToolId: 5,
        icon: Images,
        badge: "Live Endpoint",
        description: "Convert JPG, PNG, and GIF images into clean, formatted single-page or multi-page PDFs.",
        isAvailable: true,
        endpoint: "/api/users/tools/image-to-pdf",
    },
    "word-to-pdf": {
        slug: "word-to-pdf",
        name: "Word to PDF",
        categoryId: 3,
        categoryName: "PDF Tools",
        toolId: 3,
        subToolId: 4,
        icon: FileSpreadsheet,
        badge: "Live Endpoint",
        description: "Transform Word (.docx) documents into standard, printer-friendly PDF files.",
        isAvailable: true,
        endpoint: "/api/users/tools/word-to-pdf",
    },
    "pdf-merge": {
        slug: "pdf-merge",
        name: "PDF Merger",
        categoryId: 3,
        categoryName: "PDF Tools",
        toolId: 3,
        subToolId: 1,
        icon: FileStack,
        badge: "Live Endpoint",
        description: "Combine multiple PDF documents into one single structured document.",
        isAvailable: true,
        endpoint: "/api/users/tools",
    },
};

/**
 * Pre-configured sub-tools by category.
 * Used when enriching or rendering sub-tools for each category.
 */
export const SUB_TOOLS_BY_CATEGORY = {
    // Category 1: Image Tools
    1: [
        {
            slug: "image-to-pdf",
            name: "Image to PDF",
            toolId: 1,
            subToolId: 5,
            icon: Images,
            badge: "Available",
            description: "Convert image files (PNG, JPG, BMP) into a high-quality PDF.",
            isAvailable: true,
        },
        {
            slug: "image-compressor",
            name: "Image Compressor",
            toolId: 1,
            subToolId: 1,
            icon: FileArchive,
            badge: "Coming Soon",
            description: "Compress images with minimal quality degradation.",
            isAvailable: false,
        },
        {
            slug: "image-converter",
            name: "Image Converter",
            toolId: 1,
            subToolId: 2,
            icon: Sliders,
            badge: "Coming Soon",
            description: "Convert images across WebP, PNG, JPG, and SVG formats.",
            isAvailable: false,
        },
    ],

    // Category 2: Productivity Tools
    2: [
        {
            slug: "qr-code",
            name: "QR Code Generator",
            toolId: 2,
            subToolId: 1,
            icon: QrCode,
            badge: "Available",
            description: "Create customizable QR codes instantly from any web link or text.",
            isAvailable: true,
        },
        {
            slug: "uuid-generator",
            name: "UUID Generator",
            toolId: 2,
            subToolId: 2,
            icon: Hash,
            badge: "Coming Soon",
            description: "Generate cryptographically secure RFC-compliant UUID v4 identifiers.",
            isAvailable: false,
        },
        {
            slug: "word-counter",
            name: "Word Counter",
            toolId: 2,
            subToolId: 3,
            icon: AlignLeft,
            badge: "Coming Soon",
            description: "Count words, characters, sentences, and estimated reading time.",
            isAvailable: false,
        },
    ],

    // Category 3: PDF Tools
    3: [
        {
            slug: "pdf-compressor",
            name: "PDF Compressor",
            toolId: 3,
            subToolId: 3,
            icon: FileArchive,
            badge: "Available",
            description: "Shrink large PDF documents while preserving document readability.",
            isAvailable: true,
        },
        {
            slug: "pdf-merge",
            name: "PDF Merger",
            toolId: 3,
            subToolId: 1,
            icon: FileStack,
            badge: "Available",
            description: "Merge multiple separate PDF files into a single unified document.",
            isAvailable: true,
        },
        {
            slug: "image-to-pdf",
            name: "Image to PDF",
            toolId: 3,
            subToolId: 5,
            icon: Images,
            badge: "Available",
            description: "Stitch multiple images into a clean, downloadable PDF document.",
            isAvailable: true,
        },
        {
            slug: "word-to-pdf",
            name: "Word to PDF",
            toolId: 3,
            subToolId: 4,
            icon: FileSpreadsheet,
            badge: "Available",
            description: "Convert Microsoft Word .docx files directly into PDF format.",
            isAvailable: true,
        },
        {
            slug: "pdf-splitter",
            name: "PDF Splitter",
            toolId: 3,
            subToolId: 2,
            icon: Sparkles,
            badge: "Coming Soon",
            description: "Extract specific page ranges or split a PDF into separate files.",
            isAvailable: false,
        },
    ],
};
