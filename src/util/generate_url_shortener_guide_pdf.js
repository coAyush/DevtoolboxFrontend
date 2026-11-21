import fs from "fs";

/**
 * Custom PDF 1.4 Document Generator in pure Node.js
 * Generates an easy-to-understand, beginner-friendly guide with styling,
 * callout boxes, step-by-step code blocks, and diagrams.
 */
class PDFDocument {
    constructor() {
        this.pageWidth = 612;
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

        if (this.pageNumber > 1) {
            this.drawHeader();
        }
    }

    drawHeader() {
        const y = this.pageHeight - 32;
        const text = "DevToolBox • URL Shortener & Analytics Beginner Guide";
        this.currentPage.streams.push(
            `BT 0.45 0.55 0.65 rg /F2 8 Tf ${this.margin} ${y} Td (${this.escapeText(text)}) Tj ET`
        );
        this.currentPage.streams.push(
            `0.2 0.25 0.35 RG 0.5 w ${this.margin} ${y - 6} m ${this.pageWidth - this.margin} ${y - 6} l S`
        );
    }

    drawFooter() {
        for (const page of this.pages) {
            const y = 30;
            const textLeft = "DevToolBox Easy Learning Series";
            const textRight = `Page ${page.pageNumber} of ${this.pages.length}`;

            page.streams.push(
                `0.2 0.25 0.35 RG 0.5 w ${this.margin} ${y + 12} m ${this.pageWidth - this.margin} ${y + 12} l S`
            );
            page.streams.push(
                `BT 0.45 0.55 0.65 rg /F2 8 Tf ${this.margin} ${y} Td (${this.escapeText(textLeft)}) Tj ET`
            );
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

    wrapWords(text, fontSize, isMono = false, maxWidth = this.contentWidth) {
        const words = text.split(" ");
        const lines = [];
        let currentLine = "";
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
        this.currentPage.streams.push(
            `0.04 0.07 0.13 rg ${this.margin} ${y} ${this.contentWidth} ${bannerHeight} re f`
        );
        this.currentPage.streams.push(
            `0.02 0.71 0.83 RG 2 w ${this.margin} ${y} ${this.contentWidth} ${bannerHeight} re S`
        );

        this.currentPage.streams.push(
            `BT 1 1 1 rg /F1 17 Tf ${this.margin + 16} ${y + 50} Td (${this.escapeText(title)}) Tj ET`
        );
        this.currentPage.streams.push(
            `BT 0.15 0.80 0.90 rg /F2 10 Tf ${this.margin + 16} ${y + 26} Td (${this.escapeText(subtitle)}) Tj ET`
        );
        this.currentPage.streams.push(
            `BT 0.6 0.7 0.8 rg /F2 8 Tf ${this.margin + 16} ${y + 12} Td (${this.escapeText("Easiest Practical Guide • Step-by-Step Code Walkthrough • Repeatable Formula")}) Tj ET`
        );

        this.cursorY = y - 24;
    }

    addHeading1(text) {
        this.checkPageBreak(40);
        this.cursorY -= 8;
        const y = this.cursorY;

        this.currentPage.streams.push(
            `0.02 0.71 0.83 rg ${this.margin} ${y - 2} 4 16 re f`
        );
        this.currentPage.streams.push(
            `BT 0.95 0.98 1 rg /F1 13.5 Tf ${this.margin + 12} ${y} Td (${this.escapeText(text)}) Tj ET`
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

        this.currentPage.streams.push(
            `${bg} rg ${this.margin} ${y} ${this.contentWidth} ${boxHeight} re f`
        );
        this.currentPage.streams.push(
            `${border} RG 1 w ${this.margin} ${y} ${this.contentWidth} ${boxHeight} re S`
        );
        this.currentPage.streams.push(
            `BT ${titleColor} rg /F1 9 Tf ${this.margin + 14} ${y + boxHeight - 16} Td (${this.escapeText(title)}) Tj ET`
        );

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

        const headerY = this.cursorY - rowHeight;
        this.currentPage.streams.push(
            `0.08 0.12 0.20 rg ${this.margin} ${headerY} ${this.contentWidth} ${rowHeight} re f`
        );
        this.currentPage.streams.push(
            `0.25 0.35 0.50 RG 0.5 w ${this.margin} ${headerY} ${this.contentWidth} ${rowHeight} re S`
        );

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

        const pagesObj = `<< /Type /Pages /Kids [${pageObjectIds.map((id) => `${id} 0 R`).join(" ")}] /Count ${this.pages.length} >>`;
        objects[1] = pagesObj;

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
// ASSEMBLE EASY-TO-UNDERSTAND URL SHORTENER GUIDE
// =========================================================================
export const generateUrlShortenerPdf = (outputPath) => {
    const doc = new PDFDocument();

    // ---------------------------------------------------------------------
    // PAGE 1: TITLE & THE SIMPLE MENTAL MODEL
    // ---------------------------------------------------------------------
    doc.addTitleBanner(
        "URL Shortener & Analytics • The Easiest Guide",
        "How It Was Built Step-by-Step with Simple Code & Real-World Examples"
    );

    doc.addHeading1("1. The Simple Big Picture (The Restaurant Analogy)");
    doc.addParagraph(
        "Building a feature in React with a Spring Boot backend is exactly like ordering food in a restaurant. Once you grasp this 4-character story, you can build any tool or web application without hesitation!"
    );

    doc.addBullet("1. The Customer (React Component)", "The user sits on the screen (UrlShortenerTool.jsx). They type a long link and an optional alias, then click the 'Shorten URL' button. The Customer wants a short URL and wants to see how many people clicked their links.");
    doc.addBullet("2. The Waiter (UserToolsService.js)", "The Customer does not walk into the kitchen. Instead, they tell the Waiter: 'Take this longUrl, alias, toolId: 2, subToolId: 4 to the kitchen'. The Waiter uses axios to deliver the order.");
    doc.addBullet("3. The Kitchen (Spring Boot Backend)", "The Kitchen has 2 cooking stations: Station 1 (/shorten-url) saves the link into PostgreSQL and returns http://localhost:8080/examp. Station 2 (/url) returns the array of click stats and dates.");
    doc.addBullet("4. The Table (React State useState)", "The Waiter returns with the food. The Customer stores the result in React State: setGeneratedUrl(result) and setAnalytics(list). React instantly re-renders the shiny banner and the table!");

    doc.addCallout(
        "Why is this so simple?",
        "Every single feature in web development follows this exact loop: UI State -> Service Call -> Backend Response -> UI State Update. There is no magic!",
        "tip"
    );

    doc.addHeading2("The Two Backend Endpoints (From Your Postman Screenshots)");
    const endpointTable = [
        ["POST /api/users/tools/shorten-url", "{ longUrl, alias, toolId:2, subToolId:4 }", "{ details: 'http://localhost:8080/examp' }"],
        ["POST /api/users/tools/url", "{ toolId:2, subToolId:4 }", "{ details: [ { id, shortUrl, clickCount, ... } ] }"],
    ];
    doc.addTable(["Endpoint", "What We Send (Request)", "What Backend Sends Back (Response)"], endpointTable);

    // ---------------------------------------------------------------------
    // PAGE 2: STEP 1 & STEP 2 (SERVICE + REGISTRY)
    // ---------------------------------------------------------------------
    doc.addHeading1("2. Step 1: The Waiter (Writing the API Service)");
    doc.addParagraph(
        "File: src/services/user/UserToolsService.js. We write two clean functions using our authenticated axios client (usePrivateApi). Notice how easy they are:"
    );

    doc.addCodeBlock([
        "// 1. Function to Shorten a URL",
        "export const shortenUrlApi = async ({ longUrl, alias, toolId = 2, subToolId = 4 }) => {",
        "    const payload = { longUrl: longUrl.trim(), toolId, subToolId };",
        "    if (alias && alias.trim()) payload.alias = alias.trim();",
        "    // Hits POST http://localhost:8080/api/users/tools/shorten-url",
        "    return await usePrivateApi.post('/users/tools/shorten-url', payload);",
        "};",
        "",
        "// 2. Function to Get Click Analytics List",
        "export const getUrlAnalyticsApi = async ({ toolId = 2, subToolId = 4 }) => {",
        "    // Hits POST http://localhost:8080/api/users/tools/url",
        "    return await usePrivateApi.post('/users/tools/url', { toolId, subToolId });",
        "};",
    ]);

    doc.addHeading1("3. Step 2: The Menu Entry (Registering the Tool)");
    doc.addParagraph(
        "File: src/components/user/tools/toolsRegistry.js. We tell DevToolBox that this tool exists so it shows up in Productivity Tools with a Link2 icon and creates the route /user/tools/url-shortener:"
    );

    doc.addCodeBlock([
        "'url-shortener': {",
        "    slug: 'url-shortener',",
        "    name: 'URL Shortener',",
        "    categoryId: 2,                    // Productivity Tools",
        "    toolId: 2,",
        "    subToolId: 4,                     // Matches backend tool ID",
        "    icon: Link2,",
        "    badge: 'Live Endpoint',",
        "    description: 'Shorten links, create custom aliases, and track clicks.',",
        "    isAvailable: true,",
        "    endpoint: '/api/users/tools/shorten-url',",
        "},",
    ]);

    // ---------------------------------------------------------------------
    // PAGE 3: STEP 3 (THE TOOL COMPONENT)
    // ---------------------------------------------------------------------
    doc.addHeading1("4. Step 3: The UI Component (UrlShortenerTool.jsx)");
    doc.addParagraph(
        "File: src/components/user/tools/implementations/UrlShortenerTool.jsx. Let's break down the logic into 3 simple parts:"
    );

    doc.addHeading2("Part A: React State Variables");
    doc.addCodeBlock([
        "const [longUrl, setLongUrl] = useState('');       // What user types",
        "const [alias, setAlias] = useState('');           // Optional alias",
        "const [generatedUrl, setGeneratedUrl] = useState(null); // Result from server",
        "const [analytics, setAnalytics] = useState([]);   // List of shortened links",
        "const [loading, setLoading] = useState(false);    // Spinner on button",
    ]);

    doc.addHeading2("Part B: Fetching Analytics on Page Load (useEffect)");
    doc.addParagraph(
        "When the user opens the page, we automatically call the backend to get their link history and click counts:"
    );
    doc.addCodeBlock([
        "const fetchAnalytics = async () => {",
        "    const response = await getUrlAnalyticsApi({ toolId: 2, subToolId: 4 });",
        "    // response.data holds the array of links from backend",
        "    setAnalytics(response.data || []);",
        "};",
        "",
        "useEffect(() => {",
        "    fetchAnalytics(); // Runs once when page loads!",
        "}, []);",
    ]);

    doc.addHeading2("Part C: Submitting the Form (handleShorten)");
    doc.addCodeBlock([
        "const handleShorten = async (e) => {",
        "    e.preventDefault();",
        "    setLoading(true);",
        "    try {",
        "        const response = await shortenUrlApi({ longUrl, alias, toolId: 2, subToolId: 4 });",
        "        // Server gives back: 'http://localhost:8080/examp'",
        "        setGeneratedUrl(response.data);",
        "        toastCustom('Short URL generated!');",
        "        setLongUrl(''); setAlias('');",
        "        fetchAnalytics(); // Refresh table so the new link shows up instantly!",
        "    } finally {",
        "        setLoading(false);",
        "    }",
        "};",
    ]);

    // ---------------------------------------------------------------------
    // PAGE 4: STEP 4 & COMMON MISTAKES
    // ---------------------------------------------------------------------
    doc.addHeading1("5. Step 4: The Door (Hooking it into UserTools.jsx)");
    doc.addParagraph(
        "File: src/pages/user/UserTools.jsx. In the main page, we simply import our new tool and tell React: 'When the URL matches /user/tools/url-shortener, render UrlShortenerTool!'"
    );

    doc.addCodeBlock([
        "// In UserTools.jsx:",
        "import UrlShortenerTool from '../../components/user/tools/implementations/UrlShortenerTool';",
        "",
        "// Inside the tool router block:",
        "{toolSlug === 'url-shortener' && <UrlShortenerTool tool={currentTool} />}",
    ]);

    doc.addHeading1("6. Top 3 Beginner Traps & How to Avoid Them");
    doc.addCallout(
        "Trap 1: The Analytics Endpoint is POST, NOT GET!",
        "Most developers assume fetching data is always a GET request. But look at your Postman screenshot: the backend expects POST /api/users/tools/url with body { toolId: 2, subToolId: 4 }. If you used usePrivateApi.get(), the backend would respond with 405 Method Not Allowed!",
        "interview"
    );

    doc.addCallout(
        "Trap 2: Forgetting to Refresh the List After Shortening",
        "When the user creates a link, if you don't call fetchAnalytics() right after setGeneratedUrl(), the new link won't show in the table until the user manually reloads the browser! Always re-fetch list data after a successful create mutation.",
        "tip"
    );

    doc.addCallout(
        "Trap 3: URL Formatting & Trailing Spaces",
        "Users often copy URLs with accidental spaces or without https://. Always call .trim() on input values and check for http/https to prevent backend validation exceptions.",
        "info"
    );

    // ---------------------------------------------------------------------
    // PAGE 5: REPEATABLE CHEAT SHEET FOR ANY NEW TOOL
    // ---------------------------------------------------------------------
    doc.addHeading1("7. The Copy-Paste Cheat Sheet for Any New Tool");
    doc.addParagraph(
        "Whenever you build any new tool in the future (e.g. JSON Formatter, Base64 Converter, Color Picker), just copy this 1-page formula:"
    );

    doc.addBullet("File 1: UserToolsService.js", "export const myToolApi = async (data) => usePrivateApi.post('/users/tools/my-tool', data);");
    doc.addBullet("File 2: toolsRegistry.js", "'my-tool': { slug: 'my-tool', name: 'My Tool', categoryId: 2, toolId: 2, subToolId: 5, icon: Wrench, isAvailable: true }");
    doc.addBullet("File 3: MyTool.jsx", "Create form with useState -> Call myToolApi on submit -> Display result card with copy button.");
    doc.addBullet("File 4: UserTools.jsx", "Add: {toolSlug === 'my-tool' && <MyTool tool={currentTool} />}");

    doc.addCallout(
        "Summary Checklist",
        "1. Service (API call) -> 2. Registry (Metadata) -> 3. Component (State & UI) -> 4. Route (UserTools.jsx). That is the entire secret to building scalable, production-ready React applications!",
        "tip"
    );

    const pdfBuffer = doc.build();
    fs.writeFileSync(outputPath, pdfBuffer);
    console.log(`PDF successfully generated at: ${outputPath} (${pdfBuffer.length} bytes, ${doc.pages.length} pages)`);
    return doc.pages.length;
};

const targetPath = process.argv[2] || "./URL_Shortener_Implementation_Guide.pdf";
generateUrlShortenerPdf(targetPath);
