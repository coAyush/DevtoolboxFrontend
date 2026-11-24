import fs from "fs";
import path from "path";

/**
 * Custom PDF 1.4 Document Generator in pure Node.js
 * Generates an executive, developer-friendly guide with styling,
 * callout boxes, step-by-step code blocks, and architecture diagrams.
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
        const text = "DevToolBox • Auth Redirection & Natural SaaS UI Guide";
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
            const textLeft = "DevToolBox Engineering Documentation";
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
            `BT 1 1 1 rg /F1 16 Tf ${this.margin + 16} ${y + 52} Td (${this.escapeText(title)}) Tj ET`
        );
        this.currentPage.streams.push(
            `BT 0.15 0.80 0.90 rg /F2 10 Tf ${this.margin + 16} ${y + 28} Td (${this.escapeText(subtitle)}) Tj ET`
        );
        this.currentPage.streams.push(
            `BT 0.6 0.7 0.8 rg /F2 8 Tf ${this.margin + 16} ${y + 12} Td (${this.escapeText("Production Architecture Guide • Route Loaders • Axios Interceptor Protection • Natural UI")}) Tj ET`
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
            `BT 0.95 0.98 1 rg /F1 13 Tf ${this.margin + 12} ${y} Td (${this.escapeText(text)}) Tj ET`
        );
        this.cursorY -= 22;
    }

    addHeading2(text) {
        this.checkPageBreak(30);
        this.cursorY -= 6;
        const y = this.cursorY;

        this.currentPage.streams.push(
            `BT 0.25 0.82 0.92 rg /F1 10.5 Tf ${this.margin} ${y} Td (${this.escapeText(text)}) Tj ET`
        );
        this.cursorY -= 17;
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

        if (type === "warning") {
            bg = "0.15 0.08 0.05";
            border = "0.95 0.45 0.15";
            titleColor = "1 0.65 0.25";
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

        const catalogObj = `<< /Type /Catalog /Pages 2 0 R >>`;
        objects[0] = catalogObj;

        let pdf = "%PDF-1.4\n";
        const offsets = [];

        for (let i = 0; i < objects.length; i++) {
            const objNum = i + 1;
            offsets.push(Buffer.byteLength(pdf, "latin1"));
            pdf += `${objNum} 0 obj\n${objects[i]}\nendobj\n`;
        }

        const startXref = Buffer.byteLength(pdf, "latin1");
        pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;

        for (const offset of offsets) {
            const formatted = String(offset).padStart(10, "0");
            pdf += `${formatted} 00000 n \n`;
        }

        pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${startXref}\n%%EOF`;
        return Buffer.from(pdf, "latin1");
    }
}

export const generateAuthGuidePdf = (outputPath) => {
    const doc = new PDFDocument();

    // =========================================================================
    // PAGE 1: TITLE & EXECUTIVE SUMMARY
    // =========================================================================
    doc.addTitleBanner(
        "DevToolBox • Auth Redirection & Natural UI Guide",
        "How Logged-In Redirection, Route Guards & Modern SaaS Aesthetics Work"
    );

    doc.addHeading1("1. The Core Architectural Challenge");
    doc.addParagraph(
        "Modern full-stack web applications require seamless, frictionless route protection. When users visit your application, two fundamental routing rules must be strictly enforced without page flickering or navigation delays:"
    );

    doc.addBullet(
        "Rule 1 - Guest Only Guard (/login, /signup)",
        "If a user already has an active session cookie, visiting /login or /signup should immediately forward them to their dashboard (/user/dashboard). They should never see or fill the login form again."
    );
    doc.addBullet(
        "Rule 2 - Protected Workspace Guard (/user/*)",
        "If an unauthenticated visitor attempts to navigate directly to /user or /user/dashboard, they must be redirected safely to /login."
    );
    doc.addBullet(
        "Rule 3 - Anti-AI Aesthetic Transformation",
        "Removing cliché 2023 AI template tropes (spinning rainbow borders, fake macOS terminal mockups, generic AI copy) and replacing them with a grounded, high-trust human SaaS design system."
    );

    doc.addCallout(
        "Why React Router 'Loader' is Superior to 'useEffect'",
        "If you check authentication inside a component's useEffect, the login page will render for a fraction of a second, causing an annoying visual flash before jumping to the dashboard. React Router Route Loaders execute BEFORE the page component renders, guaranteeing 0ms visual flicker and instant redirection.",
        "tip"
    );

    doc.addHeading2("The Authentication Response Contract");
    doc.addParagraph(
        "When calling your backend endpoint POST /users/me with credentials, your Spring Boot server returns:"
    );

    doc.addCodeBlock([
        "// Response from POST /users/me (Status: 200 OK)",
        "{",
        "  code: 0,",
        "  message: 'User is already loggedIn',",
        "  status: 'Success',",
        "  data: {",
        "    userId: '74e75533-f1cb-4187-8116-fae3a4075973',",
        "    email: 'chowdhuryayush7@gmail.com',",
        "    role: 'USER',",
        "    authenticated: true",
        "  }",
        "}"
    ]);

    // =========================================================================
    // PAGE 2: SERVICE LAYER & AXIOS INTERCEPTOR SAFETY
    // =========================================================================
    doc.addNewPage();
    doc.addHeading1("2. Service Layer & The Interceptor Loop Trap");

    doc.addParagraph(
        "To check whether the current browser holds a valid JWT session cookie, we created a dedicated service in src/services/landing/checkLoggedinService.js:"
    );

    doc.addCodeBlock([
        "// src/services/landing/checkLoggedinService.js",
        "import { usePrivateApi } from '../../api/axiosInstance';",
        "",
        "export const checkLoggedIn = async () => {",
        "    try {",
        "        // Notice skipAuthRedirect flag to prevent infinite loops!",
        "        const res = await usePrivateApi.post('/users/me', {}, { skipAuthRedirect: true });",
        "        return res;",
        "    } catch (error) {",
        "        return null;",
        "    }",
        "};"
    ]);

    doc.addCallout(
        "CRITICAL: The 'skipAuthRedirect' Infinite Loop Trap",
        "Standard Axios private interceptors catch 401 errors and automatically execute: window.location.href = '/login?reason=expired'. If a guest visits the home page or /signup, checking /users/me returns 401! Without skipAuthRedirect, the guest would be aggressively booted to /login?reason=expired. By passing { skipAuthRedirect: true }, background checks silently return null for guests without hijacking the window location.",
        "warning"
    );

    doc.addHeading2("Axios Interceptor Implementation");
    doc.addParagraph(
        "In src/api/axiosInterceptors.js, we updated handlePrivateError to respect skipAuthRedirect:"
    );

    doc.addCodeBlock([
        "// src/api/axiosInterceptors.js",
        "const handlePrivateError = async (error) => {",
        "    const originalRequest = error.config;",
        "    ...",
        "    try {",
        "        await refreshAccessToken();",
        "        return usePrivateApi(originalRequest);",
        "    } catch (refreshError) {",
        "        // Check if caller opted out of forced login redirect",
        "        if (originalRequest?.skipAuthRedirect) {",
        "            return Promise.reject(refreshError);",
        "        }",
        "        if (!window.location.pathname.startsWith('/login')) {",
        "            window.location.href = '/login?reason=expired';",
        "        }",
        "        return Promise.reject(refreshError);",
        "    }",
        "};"
    ]);

    // =========================================================================
    // PAGE 3: ROUTE GUARDS & ROUTER CONFIGURATION
    // =========================================================================
    doc.addNewPage();
    doc.addHeading1("3. Route Guards & React Router Setup");

    doc.addParagraph(
        "In src/services/user/DahboardRedirect.js, we defined two exportable route guards using React Router's redirect() utility:"
    );

    doc.addCodeBlock([
        "// src/services/user/DahboardRedirect.js",
        "import { redirect } from 'react-router';",
        "import { checkLoggedIn } from '../landing/checkLoggedinService';",
        "",
        "// 1. Guest-only guard for /login & /signup",
        "export const redirectIfLoggedIn = async () => {",
        "    try {",
        "        const res = await checkLoggedIn();",
        "        if (res && res.code === 0 && res.data?.authenticated) {",
        "            const role = res.data?.role ? res.data.role.toLowerCase() : 'user';",
        "            return redirect(`/${role}/dashboard`);",
        "        }",
        "    } catch (e) {",
        "        return null;",
        "    }",
        "    return null;",
        "};",
        "",
        "// 2. Protected user workspace guard for /user/*",
        "export const dashboardRedirect = async ({ request }) => {",
        "    const url = new URL(request.url);",
        "    const res = await checkLoggedIn();",
        "    if (!res || res.code !== 0 || !res.data?.authenticated) {",
        "        return redirect('/login');",
        "    }",
        "    if (url.pathname === '/user' || url.pathname === '/user/') {",
        "        return redirect('/user/dashboard');",
        "    }",
        "    return null;",
        "};"
    ]);

    doc.addHeading2("Attaching Loaders to DevToolBoxRoutes.jsx");
    doc.addParagraph(
        "Attach the loader directly to the route definitions in src/routes/DevToolBoxRoutes.jsx:"
    );

    doc.addCodeBlock([
        "// src/routes/DevToolBoxRoutes.jsx",
        "export const router = createBrowserRouter([",
        "    { path: '/login', element: <Login />, loader: redirectIfLoggedIn },",
        "    { path: '/signup', element: <Signup />, loader: redirectIfLoggedIn },",
        "    {",
        "        path: '/user',",
        "        element: <UserAppLayout />,",
        "        loader: dashboardRedirect,",
        "        children: [",
        "            { path: 'dashboard', element: <UserDashboard /> },",
        "            { path: 'tools', element: <UserTools /> },",
        "            ...",
        "        ]",
        "    }",
        "]);"
    ]);

    // =========================================================================
    // PAGE 4: DYNAMIC NAVBAR & NATURAL UI SYSTEM
    // =========================================================================
    doc.addNewPage();
    doc.addHeading1("4. Dynamic Header State & Natural UI System");

    doc.addParagraph(
        "When an authenticated user browses public marketing pages (like / or /tools), the top navigation bar should adapt and show a 'Go to Dashboard' CTA instead of 'Log In' / 'Get Started'."
    );

    doc.addCodeBlock([
        "// src/layout/Header.jsx",
        "useEffect(() => {",
        "    checkLoggedIn().then(res => {",
        "        if (res?.code === 0 && res.data?.authenticated) {",
        "            setUserAuth(res.data);",
        "        } else {",
        "            setUserAuth(null);",
        "        }",
        "    });",
        "}, [pathname]);",
        "",
        "{userAuth ? (",
        "    <NavLink to={dashboardPath} className='... bg-cyan-400 text-slate-950 font-semibold ...'>",
        "        <LayoutDashboard className='w-4 h-4' />",
        "        <span>Go to Dashboard</span>",
        "    </NavLink>",
        ") : (",
        "    <>",
        "        <NavLink to='/login'>Log in</NavLink>",
        "        <NavLink to='/signup'>Get Started</NavLink>",
        "    </>",
        ")}"
    ]);

    doc.addHeading2("The Anti-AI UI Transformation Matrix");
    doc.addParagraph(
        "Summary of design decisions taken to transform the template into a natural, human-engineered product:"
    );

    doc.addTable(
        ["Component", "Previous 'AI-Generated' Look", "New Natural SaaS Design"],
        [
            ["Canvas", "Blurry cyan/purple radial blobs", "Deep slate (#080c14) + fine architectural grid"],
            ["Borders", "Rotating rainbow animate-border-flow", "Crisp 1px slate-800 borders + subtle hover"],
            ["Auth Box", "Wrapped in fake macOS terminal mock", "Centered clean card (Linear/Clerk style)"],
            ["OTP Verification", "Green broken back icon & rainbow btn", "Clean slate card, 6 tactile boxes, working Back"],
            ["Copywriting", "'For Normal Users', 'makking work easy'", "'Web Studio Workspace', authentic human copy"],
            ["Buttons", "Neon pink-to-purple-to-cyan glow", "Solid Electric Cyan with smooth tactile hover"]
        ]
    );

    // =========================================================================
    // PAGE 5: STEP-BY-STEP VERIFICATION & TESTING
    // =========================================================================
    doc.addNewPage();
    doc.addHeading1("5. Testing & Verification Checklist");

    doc.addParagraph(
        "Run these simple verification steps to confirm everything is working smoothly in production:"
    );

    doc.addBullet(
        "Test 1 - Logged-In User visits /login",
        "Open DevToolBox while logged in. Type /login into the URL bar and press Enter. Result: The browser immediately redirects to /user/dashboard without flashing the login form."
    );
    doc.addBullet(
        "Test 2 - Logged-In User visits /signup",
        "Type /signup into the URL bar and press Enter. Result: The browser immediately redirects to /user/dashboard."
    );
    doc.addBullet(
        "Test 3 - Guest visits /user/dashboard directly",
        "Open an Incognito window (no cookies). Visit /user/dashboard. Result: dashboardRedirect detects no authenticated session and safely sends the user to /login."
    );
    doc.addBullet(
        "Test 4 - Guest visits / (Landing Page)",
        "Visit the home page as a guest. Result: checkLoggedIn returns null without kicking the user to /login?reason=expired. The landing page renders cleanly."
    );
    doc.addBullet(
        "Test 5 - Dynamic Header Check",
        "When logged in, navigate to /features or /tools. Notice the top-right button says 'Go to Dashboard' with a dashboard icon."
    );

    doc.addCallout(
        "Complete File Locations",
        "1. src/services/landing/checkLoggedinService.js - POST /users/me\n2. src/services/user/DahboardRedirect.js - redirectIfLoggedIn & dashboardRedirect\n3. src/routes/DevToolBoxRoutes.jsx - Route loader attachments\n4. src/api/axiosInterceptors.js - skipAuthRedirect interceptor guard\n5. src/layout/Header.jsx - Dynamic authenticated navbar",
        "tip"
    );

    const pdfBuffer = doc.build();
    fs.writeFileSync(outputPath, pdfBuffer);
    console.log(`PDF successfully generated at: ${outputPath} (${pdfBuffer.length} bytes, ${doc.pages.length} pages)`);
    return doc.pages.length;
};

// Generate in both assets and project root
const assetsPath = path.resolve("./src/assets/Auth_Redirection_and_UI_Guide.pdf");
const rootPath = path.resolve("./DevToolBox_Auth_Redirection_Guide.pdf");

generateAuthGuidePdf(assetsPath);
generateAuthGuidePdf(rootPath);
