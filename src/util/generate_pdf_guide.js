import fs from "fs";
import path from "path";

/**
 * Custom PDF 1.4 Document Generator in pure Node.js
 * Generates structured, publication-grade multi-page PDFs with styling,
 * headers, footers, page numbering, code blocks, tables, and callout boxes.
 */
class PDFDocument {
    constructor() {
        this.pageWidth = 612; // 8.5 x 11 inches in points
        this.pageHeight = 792;
        this.margin = 48;
        this.contentWidth = this.pageWidth - this.margin * 2;
        this.pages = [];
        this.currentPage = null;
        this.cursorY = 0;
        this.fontBoldId = 3;
        this.fontRegularId = 4;
        this.fontMonoId = 5;
        this.pageNumber = 0;
        this.addNewPage();
    }

    addNewPage() {
        this.pageNumber += 1;
        this.currentPage = {
            pageNumber: this.pageNumber,
            streams: [],
        };
        this.pages.push(this.currentPage);
        this.cursorY = this.pageHeight - this.margin - 24;

        // Draw top running header (except on page 1)
        if (this.pageNumber > 1) {
            this.drawHeader();
        }
    }

    drawHeader() {
        const y = this.pageHeight - 32;
        const text = "DevToolBox • Full-Stack Architecture & Interview Guide";
        this.currentPage.streams.push(
            `BT 0.45 0.55 0.65 rg /F2 8 Tf ${this.margin} ${y} Td (${this.escapeText(text)}) Tj ET`
        );
        // Header divider line
        this.currentPage.streams.push(
            `0.2 0.25 0.35 RG 0.5 w ${this.margin} ${y - 6} m ${this.pageWidth - this.margin} ${y - 6} l S`
        );
    }

    drawFooter() {
        for (const page of this.pages) {
            const y = 30;
            const textLeft = "DevToolBox Engineering Playbook";
            const textRight = `Page ${page.pageNumber} of ${this.pages.length}`;

            // Divider line
            page.streams.push(
                `0.2 0.25 0.35 RG 0.5 w ${this.margin} ${y + 12} m ${this.pageWidth - this.margin} ${y + 12} l S`
            );
            // Left text
            page.streams.push(
                `BT 0.45 0.55 0.65 rg /F2 8 Tf ${this.margin} ${y} Td (${this.escapeText(textLeft)}) Tj ET`
            );
            // Right page number
            page.streams.push(
                `BT 0.45 0.55 0.65 rg /F2 8 Tf ${this.pageWidth - this.margin - 60} ${y} Td (${this.escapeText(textRight)}) Tj ET`
            );
        }
    }

    checkPageBreak(neededHeight) {
        if (this.cursorY - neededHeight < this.margin + 36) {
            this.addNewPage();
        }
    }

    escapeText(str) {
        if (!str) return "";
        return String(str)
            .replace(/\\/g, "\\\\")
            .replace(/\(/g, "\\(")
            .replace(/\)/g, "\\)")
            .replace(/[\u2018\u2019]/g, "'")
            .replace(/[\u201C\u201D]/g, '"')
            .replace(/\u2014/g, "--")
            .replace(/\u2013/g, "-")
            .replace(/\u2022/g, "*")
            .replace(/[^\x20-\x7E]/g, " ");
    }

    // Wrap words into lines that fit within max width
    wrapWords(text, fontSize, isMono = false, maxWidth = this.contentWidth) {
        const words = text.split(" ");
        const lines = [];
        let currentLine = "";
        // Average char width estimate
        const charWidth = isMono ? fontSize * 0.6 : fontSize * 0.52;

        for (const word of words) {
            const testLine = currentLine ? `${currentLine} ${word}` : word;
            const testWidth = testLine.length * charWidth;
            if (testWidth <= maxWidth) {
                currentLine = testLine;
            } else {
                if (currentLine) lines.push(currentLine);
                currentLine = word;
            }
        }
        if (currentLine) lines.push(currentLine);
        return lines.length > 0 ? lines : [""];
    }

    addTitleBanner(title, subtitle) {
        const bannerHeight = 84;
        this.checkPageBreak(bannerHeight + 20);

        const y = this.cursorY - bannerHeight;
        // Dark banner rectangle
        this.currentPage.streams.push(
            `0.04 0.07 0.13 rg ${this.margin} ${y} ${this.contentWidth} ${bannerHeight} re f`
        );
        // Cyan accent border
        this.currentPage.streams.push(
            `0.02 0.71 0.83 RG 2 w ${this.margin} ${y} ${this.contentWidth} ${bannerHeight} re S`
        );

        // Title text
        this.currentPage.streams.push(
            `BT 1 1 1 rg /F1 18 Tf ${this.margin + 16} ${y + 50} Td (${this.escapeText(title)}) Tj ET`
        );
        // Subtitle text
        this.currentPage.streams.push(
            `BT 0.15 0.80 0.90 rg /F2 10 Tf ${this.margin + 16} ${y + 26} Td (${this.escapeText(subtitle)}) Tj ET`
        );
        // Tagline
        this.currentPage.streams.push(
            `BT 0.6 0.7 0.8 rg /F2 8 Tf ${this.margin + 16} ${y + 12} Td (${this.escapeText("Production-Grade Blueprint • Architectural Patterns • Technical Interview Masterclass")}) Tj ET`
        );

        this.cursorY = y - 24;
    }

    addHeading1(text) {
        this.checkPageBreak(40);
        this.cursorY -= 8;
        const y = this.cursorY;

        // Accent pill
        this.currentPage.streams.push(
            `0.02 0.71 0.83 rg ${this.margin} ${y - 2} 4 16 re f`
        );

        this.currentPage.streams.push(
            `BT 0.95 0.98 1 rg /F1 14 Tf ${this.margin + 12} ${y} Td (${this.escapeText(text)}) Tj ET`
        );

        this.cursorY -= 22;
    }

    addHeading2(text) {
        this.checkPageBreak(30);
        this.cursorY -= 6;
        const y = this.cursorY;

        this.currentPage.streams.push(
            `BT 0.25 0.82 0.92 rg /F1 11 Tf ${this.margin} ${y} Td (${this.escapeText(text)}) Tj ET`
        );

        this.cursorY -= 17;
    }

    addHeading3(text) {
        this.checkPageBreak(24);
        const y = this.cursorY;

        this.currentPage.streams.push(
            `BT 0.85 0.90 0.95 rg /F1 9.5 Tf ${this.margin} ${y} Td (${this.escapeText(text)}) Tj ET`
        );

        this.cursorY -= 15;
    }

    addParagraph(text, options = {}) {
        const fontSize = options.size || 9;
        const lineHeight = fontSize + 4.5;
        const color = options.color || [0.75, 0.82, 0.9];
        const lines = this.wrapWords(text, fontSize);

        for (const line of lines) {
            this.checkPageBreak(lineHeight);
            this.currentPage.streams.push(
                `BT ${color.join(" ")} rg /F2 ${fontSize} Tf ${this.margin} ${this.cursorY} Td (${this.escapeText(line)}) Tj ET`
            );
            this.cursorY -= lineHeight;
        }
        this.cursorY -= (options.spaceAfter !== undefined ? options.spaceAfter : 4);
    }

    addBullet(title, description) {
        const fontSize = 8.5;
        const lineHeight = fontSize + 4;
        const fullText = description ? `${title}: ${description}` : title;
        const lines = this.wrapWords(fullText, fontSize, false, this.contentWidth - 14);

        this.checkPageBreak(lines.length * lineHeight + 4);

        // Bullet dot
        this.currentPage.streams.push(
            `0.02 0.71 0.83 rg ${this.margin + 2} ${this.cursorY + 2} 3 3 re f`
        );

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            const font = i === 0 && description ? "/F1" : "/F2";
            const color = i === 0 && description ? "0.95 0.98 1" : "0.75 0.82 0.9";
            this.currentPage.streams.push(
                `BT ${color} rg ${font} ${fontSize} Tf ${this.margin + 12} ${this.cursorY} Td (${this.escapeText(line)}) Tj ET`
            );
            this.cursorY -= lineHeight;
            if (i < lines.length - 1) this.checkPageBreak(lineHeight);
        }
        this.cursorY -= 2;
    }

    addCallout(title, text, type = "info") {
        const fontSize = 8.5;
        const lines = this.wrapWords(text, fontSize, false, this.contentWidth - 28);
        const boxHeight = lines.length * 13 + 30;

        this.checkPageBreak(boxHeight + 8);
        const y = this.cursorY - boxHeight;

        let bg = "0.05 0.09 0.16";
        let border = "0.02 0.71 0.83";
        let titleColor = "0.15 0.85 0.95";

        if (type === "interview") {
            bg = "0.08 0.07 0.16";
            border = "0.55 0.35 0.95";
            titleColor = "0.75 0.60 1";
        } else if (type === "tip") {
            bg = "0.04 0.12 0.10";
            border = "0.10 0.75 0.50";
            titleColor = "0.20 0.90 0.60";
        }

        // Background
        this.currentPage.streams.push(
            `${bg} rg ${this.margin} ${y} ${this.contentWidth} ${boxHeight} re f`
        );
        // Border
        this.currentPage.streams.push(
            `${border} RG 1 w ${this.margin} ${y} ${this.contentWidth} ${boxHeight} re S`
        );

        // Header Title
        this.currentPage.streams.push(
            `BT ${titleColor} rg /F1 9 Tf ${this.margin + 14} ${y + boxHeight - 16} Td (${this.escapeText(title)}) Tj ET`
        );

        // Content
        let textY = y + boxHeight - 30;
        for (const line of lines) {
            this.currentPage.streams.push(
                `BT 0.85 0.90 0.95 rg /F2 ${fontSize} Tf ${this.margin + 14} ${textY} Td (${this.escapeText(line)}) Tj ET`
            );
            textY -= 13;
        }

        this.cursorY = y - 10;
    }

    addCodeBlock(codeLines) {
        const fontSize = 7.5;
        const lineHeight = 11;
        const boxHeight = codeLines.length * lineHeight + 14;

        this.checkPageBreak(boxHeight + 8);
        const y = this.cursorY - boxHeight;

        // Code box background
        this.currentPage.streams.push(
            `0.03 0.05 0.09 rg ${this.margin} ${y} ${this.contentWidth} ${boxHeight} re f`
        );
        this.currentPage.streams.push(
            `0.18 0.22 0.32 RG 0.75 w ${this.margin} ${y} ${this.contentWidth} ${boxHeight} re S`
        );

        let codeY = y + boxHeight - 11;
        for (const line of codeLines) {
            this.currentPage.streams.push(
                `BT 0.30 0.85 0.95 rg /F3 ${fontSize} Tf ${this.margin + 12} ${codeY} Td (${this.escapeText(line)}) Tj ET`
            );
            codeY -= lineHeight;
        }

        this.cursorY = y - 10;
    }

    addTable(headers, rows) {
        const colCount = headers.length;
        const colWidth = this.contentWidth / colCount;
        const rowHeight = 16;
        const totalHeight = (rows.length + 1) * rowHeight + 8;

        this.checkPageBreak(totalHeight);

        // Header Row background
        const headerY = this.cursorY - rowHeight;
        this.currentPage.streams.push(
            `0.08 0.12 0.20 rg ${this.margin} ${headerY} ${this.contentWidth} ${rowHeight} re f`
        );
        this.currentPage.streams.push(
            `0.25 0.35 0.50 RG 0.5 w ${this.margin} ${headerY} ${this.contentWidth} ${rowHeight} re S`
        );

        // Header Text
        for (let i = 0; i < colCount; i++) {
            this.currentPage.streams.push(
                `BT 0.95 0.98 1 rg /F1 8 Tf ${this.margin + i * colWidth + 6} ${headerY + 4} Td (${this.escapeText(headers[i])}) Tj ET`
            );
        }

        let currentY = headerY;
        for (let r = 0; r < rows.length; r++) {
            currentY -= rowHeight;
            const row = rows[r];
            const isEven = r % 2 === 0;

            if (isEven) {
                this.currentPage.streams.push(
                    `0.04 0.06 0.11 rg ${this.margin} ${currentY} ${this.contentWidth} ${rowHeight} re f`
                );
            }
            this.currentPage.streams.push(
                `0.15 0.20 0.30 RG 0.5 w ${this.margin} ${currentY} ${this.contentWidth} ${rowHeight} re S`
            );

            for (let c = 0; c < colCount; c++) {
                const cellText = row[c] || "";
                this.currentPage.streams.push(
                    `BT 0.80 0.86 0.92 rg /F2 7.5 Tf ${this.margin + c * colWidth + 6} ${currentY + 4} Td (${this.escapeText(cellText)}) Tj ET`
                );
            }
        }

        this.cursorY = currentY - 12;
    }

    build() {
        this.drawFooter();

        const objects = [];
        const addObject = (content) => {
            objects.push(content);
            return objects.length;
        };

        // Standard 14 Standard Type1 Fonts
        const fontBoldId = addObject("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>");
        const fontRegularId = addObject("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>");
        const fontMonoId = addObject("<< /Type /Font /Subtype /Type1 /BaseFont /Courier >>");

        const pageObjectIds = [];
        for (const p of this.pages) {
            const streamContent = p.streams.join("\n");
            const streamLength = Buffer.byteLength(streamContent, "latin1");
            const streamId = addObject(`<< /Length ${streamLength} >>\nstream\n${streamContent}\nendstream`);
            const pageId = addObject(
                `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${this.pageWidth} ${this.pageHeight}] /Resources << /Font << /F1 ${fontBoldId} 0 R /F2 ${fontRegularId} 0 R /F3 ${fontMonoId} 0 R >> >> /Contents ${streamId} 0 R >>`
            );
            pageObjectIds.push(pageId);
        }

        // Obj 2 is Pages catalog
        const pagesObj = `<< /Type /Pages /Kids [${pageObjectIds.map((id) => `${id} 0 R`).join(" ")}] /Count ${this.pages.length} >>`;
        objects[1] = pagesObj;

        // Obj 1 is Root Catalog
        const catalogObj = "<< /Type /Catalog /Pages 2 0 R >>";
        objects[0] = catalogObj;

        let body = "%PDF-1.4\n";
        const xref = ["0000000000 65535 f \n"];

        for (let i = 0; i < objects.length; i++) {
            const currentOffset = Buffer.byteLength(body, "latin1");
            xref.push(String(currentOffset).padStart(10, "0") + " 00000 n \n");
            body += `${i + 1} 0 obj\n${objects[i]}\nendobj\n`;
        }

        const startxref = Buffer.byteLength(body, "latin1");
        body +=
            `xref\n0 ${objects.length + 1}\n` +
            xref.join("") +
            `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${startxref}\n%%EOF`;

        return Buffer.from(body, "latin1");
    }
}

// =========================================================================
// ASSEMBLE COMPLETE ARCHITECTURE & INTERVIEW MASTERCLASS DOCUMENT
// =========================================================================
export const generatePdfGuide = (outputPath) => {
    const doc = new PDFDocument();

    // ---------------------------------------------------------------------
    // PAGE 1: TITLE & EXECUTIVE ARCHITECTURE
    // ---------------------------------------------------------------------
    doc.addTitleBanner(
        "DevToolBox • Full-Stack Architecture Blueprint",
        "How the User Tool Suite, Navigation, Modals & Micro-Services Were Built"
    );

    doc.addHeading1("1. Executive Summary & High-Level Architecture");
    doc.addParagraph(
        "This master documentation outlines the comprehensive engineering blueprint implemented for the DevToolBox User Tool Suite (/user/tools). It provides both an operational walkthrough of the codebase and an interview-ready playbook explaining the architectural patterns, state machines, API integration layer, and binary streaming mechanics used to build modern, production-grade web applications."
    );

    doc.addCallout(
        "The Core Problem Solved",
        "The application required an interactive suite where a logged-in user can dynamically inspect tool categories, open category-specific sub-tool menus via an animated modal, and launch dedicated tool controller workspaces connected to Spring Boot backend micro-services, all while preserving the existing authentication, layout, dashboard, and cyberpunk dark theme.",
        "info"
    );

    doc.addHeading2("End-to-End Request & User Journey Flow");
    doc.addBullet("Phase 1 - Suite Mount", "User navigates to /user/tools -> DevToolBoxRoutes.jsx renders UserTools.jsx -> Component triggers getToolsSuite() hitting GET /api/users/tools-suite -> Categories are deduplicated by toolId and displayed as sleek Category Folders.");
    doc.addBullet("Phase 2 - Folder Modal", "User clicks a category folder card -> SubToolsModal opens -> Hits GET /api/users/sub-tools-suite?toolId={toolId} -> Dynamically maps and enriches sub-tools with status indicators (Live vs Coming Soon).");
    doc.addBullet("Phase 3 - Tool Controller", "User clicks an available tool -> React Router navigates to /user/tools/:toolSlug -> UserTools.jsx mounts the dedicated tool workspace (e.g., QR Code, PDF Compressor, Merge) wrapped in ToolPageWrapper.");
    doc.addBullet("Phase 4 - API Execution", "User interacts with the controller -> Service dispatches optimized JSON or multipart/form-data payload -> Axios interceptor handles JWT cookies and streams back JSON or binary PDF Blobs directly into browser downloads.");

    // ---------------------------------------------------------------------
    // PAGE 2: COMPONENT & SERVICE BREAKDOWN
    // ---------------------------------------------------------------------
    doc.addHeading1("2. Detailed Component & Implementation Breakdown");

    doc.addHeading2("A. Navigation & Dynamic Sub-Routing");
    doc.addParagraph(
        "In DevToolBoxRoutes.jsx, the router configuration was extended under the protected UserAppLayout shell. Instead of creating disconnected routes that break layout context, we defined both /user/tools and /user/tools/:toolSlug pointing to UserTools.jsx. In UserNavbar.jsx, the Tool Suite NavLink uses end=false so the sidebar tab stays illuminated with the cyan glow when using any tool."
    );

    doc.addHeading2("B. The Category Suite Page & Defensive Normalization");
    doc.addParagraph(
        "When GET /api/users/tools-suite is requested, the Spring Boot database returns multiple rows per category. We implemented a Map-based deduplication algorithm in UserTools.jsx that aggregates unique categories by toolId and calculates the sub-tool count dynamically."
    );

    doc.addCodeBlock([
        "// Defensive Category Normalization in UserTools.jsx",
        "const categoryMap = new Map();",
        "rawDetails.forEach((item) => {",
        "    const id = item.toolId || item.id;",
        "    if (!categoryMap.has(id)) {",
        "        categoryMap.set(id, { toolId: id, toolCategory: item.toolCategory, toolCount: 1 });",
        "    } else {",
        "        categoryMap.get(id).toolCount += 1;",
        "    }",
        "});",
    ]);

    doc.addHeading2("C. Sub-Tools Modal & Catalog Enrichment Engine");
    doc.addParagraph(
        "SubToolsModal.jsx connects to GET /api/users/sub-tools-suite?toolId={id}. To shield the UI from inconsistent backend column names, the modal employs a Client-Side Catalog Enrichment Engine (toolsRegistry.js) that maps IDs to verified names, icons, descriptions, and availability badges."
    );

    // ---------------------------------------------------------------------
    // PAGE 3: THE 5 LIVE TOOL CONTROLLERS
    // ---------------------------------------------------------------------
    doc.addHeading1("3. The 5 Live Tool Controllers & Endpoints");

    const toolSummaryTable = [
        ["URL Shortener", "Productivity (id:2, sub:4)", "POST /api/users/tools/shorten-url", "JSON -> Short URL + Analytics"],
        ["QR Code Generator", "Productivity (id:2, sub:1)", "POST /api/users/tools/qr-code", "JSON -> Cloudinary URL"],
        ["PDF Compressor", "PDF Tools (id:3, sub:3)", "POST /api/users/tools/pdf-compressor", "FormData -> Binary Blob"],
        ["Image to PDF", "PDF Tools (id:3, sub:5)", "POST /api/users/tools/image-to-pdf", "FormData -> Binary Blob"],
        ["Word to PDF", "PDF Tools (id:3, sub:4)", "POST /api/users/tools/word-to-pdf", "FormData -> Binary Blob"],
        ["PDF Merger", "PDF Tools (id:3, sub:1)", "POST /api/users/tools", "FormData -> Binary Blob"],
    ];
    doc.addTable(["Tool Name", "Category & IDs", "Backend Endpoint", "Data Flow Contract"], toolSummaryTable);

    doc.addHeading2("Deep Dive into Specialized Tool Capabilities");
    doc.addBullet("UrlShortenerTool.jsx", "Accepts destination URLs with optional custom aliases. Connects to POST /api/users/tools/shorten-url to create short links and POST /api/users/tools/url to stream live analytics: total clicks, created dates, active vs expired statuses, and last click timestamps.");
    doc.addBullet("QrCodeTool.jsx", "Accepts URL/text payloads with selectable dimensions (200px to 500px). Upon generation, it renders the Cloudinary image preview, allows direct PNG download, clipboard copying, and auto-saves the last 6 generations to localStorage.");
    doc.addBullet("PdfCompressorTool.jsx", "Accepts PDF files up to 25MB via drag-and-drop. Provides 3 GhostScript compression profiles (LOW: Print, MEDIUM: Balanced, HIGH: Screen/Email). Downloads the compressed file and displays byte savings.");
    doc.addBullet("ImageToPdfTool.jsx", "Accepts up to 20 images (JPG, PNG, GIF, BMP). Displays an interactive thumbnail gallery with individual delete buttons and supports FIT_IMAGE or standard A4 page layout modes.");
    doc.addBullet("WordToPdfTool.jsx", "Converts Microsoft Word (.docx) files into clean, printable PDFs with input format validation and error handling.");
    doc.addBullet("PdfMergeTool.jsx", "Allows users to upload 2 to 20 PDFs and reorder their merge sequence with Move Up/Down controls before submitting to the backend.");

    // ---------------------------------------------------------------------
    // PAGE 4: NETWORK LAYER & BINARY BLOB STREAMING
    // ---------------------------------------------------------------------
    doc.addHeading1("4. Axios Network Layer: Dual Payload & Binary Streams");
    doc.addParagraph(
        "One of the critical technical challenges in full-stack engineering is handling dual payload types: standard JSON responses alongside binary file streams (PDF blobs) without breaking existing interceptors."
    );

    doc.addCallout(
        "The Binary Blob Interceptor Problem & Solution",
        "Default Axios response interceptors expect response.data to be a JSON object with { code, message, data }. When an endpoint returns a PDF byte array with responseType: 'blob', checking response.data.code returns undefined and strips the file bytes! We updated axiosInterceptors.js to detect Blob instances and pass them directly to the caller, while checking if an error JSON was encapsulated inside the blob.",
        "tip"
    );

    doc.addCodeBlock([
        "// Support Binary Blobs & Multipart in axiosInterceptors.js",
        "const handleResponse = async (response) => {",
        "    if (response.data instanceof Blob || response.config?.responseType === 'blob') {",
        "        if (response.data?.type === 'application/json') {",
        "            const text = await response.data.text();",
        "            const parsed = JSON.parse(text);",
        "            if (parsed.code === 8) return Promise.reject(new Error(parsed.message));",
        "        }",
        "        return response.data; // Pass binary Blob directly to caller!",
        "    }",
        "    return { code: response.data?.code, data: response.data?.data?.details };",
        "};",
        "// Automatic Content-Type stripping for FormData",
        "usePrivateApi.interceptors.request.use((config) => {",
        "    if (config.data instanceof FormData) delete config.headers['Content-Type'];",
        "    return config;",
        "});",
    ]);

    // ---------------------------------------------------------------------
    // PAGE 5: THE UNIVERSAL 5-LAYER TEMPLATE
    // ---------------------------------------------------------------------
    doc.addHeading1("5. The Universal 5-Layer Template for Any Web App");
    doc.addParagraph(
        "To build any new web app or feature quickly and cleanly, follow this standardized 5-layer mental model. Each layer has strict responsibilities, ensuring modularity, easy maintenance, and rapid scalability."
    );

    doc.addBullet("Layer 1: Routing Layer (src/routes/)", "Defines URL paths, protected layouts, and dynamic parameters (e.g., /user/tools/:toolSlug). Keeps route logic decoupled from UI.");
    doc.addBullet("Layer 2: Layout Layer (src/layout/)", "Provides shells, navigation sidebars, breadcrumbs, and responsive viewports (e.g., UserAppLayout, UserNavbar).");
    doc.addBullet("Layer 3: Page Controllers (src/pages/)", "Coordinates data fetching on mount, manages global page state (e.g., categories, active modal), and handles fallback logic.");
    doc.addBullet("Layer 4: Component / Registry Layer (src/components/)", "Contains presentation cards, modals, and isolated tool implementations. Centralized registries (toolsRegistry.js) decouple UI from backend schemas.");
    doc.addBullet("Layer 5: Service & Network Layer (src/services/ & src/api/)", "Centralizes all HTTP calls, FormData assembly, and response parsing. Components never invoke axios directly.");

    doc.addHeading2("How to Add Any New Tool in 3 Simple Steps");
    doc.addBullet("Step 1 - Service", "Add export const myToolApi = async (data) => usePrivateApi.post('/users/tools/new', data) in UserToolsService.js.");
    doc.addBullet("Step 2 - Registry", "Add entry with slug, name, icon, and endpoint in toolsRegistry.js.");
    doc.addBullet("Step 3 - Component", "Create MyTool.jsx in implementations/ and render in UserTools.jsx.");

    // ---------------------------------------------------------------------
    // PAGE 6: DIRECTORY MAP ("WHAT IS WHERE")
    // ---------------------------------------------------------------------
    doc.addHeading1("6. Directory Map: What is Where");
    doc.addParagraph(
        "Use this reference map whenever you want to locate an existing feature or decide where to place new files:"
    );

    const dirMap = [
        ["src/api/axiosInstance.js", "Axios client definitions (usePublicApi, usePrivateApi) with baseURL."],
        ["src/api/axiosInterceptors.js", "JWT token refresh, 401 recovery, and binary Blob/FormData interceptors."],
        ["src/services/user/UserToolsService.js", "All user tool suite API calls (tools-suite, sub-tools, qr, pdf tools)."],
        ["src/pages/user/UserTools.jsx", "Main suite controller: renders Category Folders, Modal, and Tool pages."],
        ["src/components/user/tools/toolsRegistry.js", "Catalog metadata: categories, sub-tool definitions, icons, endpoints."],
        ["src/components/user/tools/ToolCategoryCard.jsx", "Folder-styled card with glassmorphism and cyan glow on hover."],
        ["src/components/user/tools/SubToolsModal.jsx", "Modal displaying sub-tools with live vs coming-soon status."],
        ["src/components/user/tools/ToolPageWrapper.jsx", "Unified workspace header with breadcrumbs and Back button."],
        ["src/components/user/tools/fileDownloadHelper.js", "Utilities for triggering browser file downloads and formatting bytes."],
        ["src/components/user/tools/implementations/", "Houses QrCodeTool, PdfCompressorTool, ImageToPdfTool, etc."],
        ["src/routes/DevToolBoxRoutes.jsx", "Application routing table, loaders, and protected route definitions."],
    ];
    doc.addTable(["File / Directory Path", "Architectural Role & Description"], dirMap);

    // ---------------------------------------------------------------------
    // PAGE 7: TECHNICAL INTERVIEW PLAYBOOK
    // ---------------------------------------------------------------------
    doc.addHeading1("7. Technical Interview Masterclass");
    doc.addParagraph(
        "When interviewers ask you about DevToolBox or how you built the Tool Suite, use these structured answers to demonstrate senior-level engineering depth."
    );

    doc.addCallout(
        "Question 1: 'Can you walk me through the architecture of the Tool Suite?'",
        "Answer: 'I architected a modular, registry-driven tool suite. On route mount (/user/tools), the client calls GET /api/users/tools-suite. Because backend queries often return denormalized duplicate rows, I implemented a client-side Map aggregation to deduplicate categories by toolId and compute real-time tool counts. Clicking a category folder opens a lazy-loaded modal that queries sub-tools dynamically. Clicking any tool navigates to /user/tools/:toolSlug, which mounts the dedicated tool controller wrapped in a unified layout shell with breadcrumbs. This separation ensures zero coupling between individual tool implementations.'",
        "interview"
    );

    doc.addCallout(
        "Question 2: 'How did you handle file uploads and PDF downloads with Axios?'",
        "Answer: 'For file uploads like PDF compression and multi-image conversion, I assembled multipart/form-data payloads and created a request interceptor to strip default application/json headers, allowing the browser to set the correct boundary. For downloads, Spring Boot streams ResponseEntity<byte[]> as application/pdf. Standard Axios interceptors strip non-JSON bodies, so I enhanced our response interceptor to detect Blob instances, verify whether an error JSON was encapsulated inside the blob, and pipe the binary stream directly to an in-memory Object URL (window.URL.createObjectURL) to trigger instantaneous client-side file downloads with zero data loss.'",
        "interview"
    );

    doc.addCallout(
        "Question 3: 'How did you ensure state isolation and UX responsiveness?'",
        "Answer: 'Each tool controller maintains its own isolated state machine (file drag-and-drop, validation, progress loaders, and download triggers). For QR code generation, I implemented client-side localStorage caching to persist the user's recent generations across page refreshes. For PDF merging, I implemented an interactive reordering array so users can resequence documents before dispatching. Furthermore, I used Lucide icon sets, CSS backdrop-blur, and responsive grid breakpoints (grid-cols-1 to sm:grid-cols-2 to lg:grid-cols-3) to ensure seamless performance across mobile and desktop viewports.'",
        "interview"
    );

    const pdfBuffer = doc.build();
    fs.writeFileSync(outputPath, pdfBuffer);
    console.log(`PDF successfully generated at: ${outputPath} (${pdfBuffer.length} bytes, ${doc.pages.length} pages)`);
    return doc.pages.length;
};

// If run directly
const targetPath = process.argv[2] || "./DevToolBox_Architecture_and_Interview_Guide.pdf";
generatePdfGuide(targetPath);
