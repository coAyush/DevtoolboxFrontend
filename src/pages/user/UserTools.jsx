import React, { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router";
import {
    Search,
    Folder,
    Sparkles,
    Boxes,
    Loader2,
    SlidersHorizontal,
    FolderTree,
    Layers
} from "lucide-react";
import { getToolsSuite } from "../../services/user/UserToolsService";
import ToolCategoryCard from "../../components/user/tools/ToolCategoryCard";
import SubToolsModal from "../../components/user/tools/SubToolsModal";
import ToolPageWrapper from "../../components/user/tools/ToolPageWrapper";
import { TOOLS_CATALOG, CATEGORY_METADATA } from "../../components/user/tools/toolsRegistry";

// Import tool implementations
import QrCodeTool from "../../components/user/tools/implementations/QrCodeTool";
import PdfCompressorTool from "../../components/user/tools/implementations/PdfCompressorTool";
import ImageToPdfTool from "../../components/user/tools/implementations/ImageToPdfTool";
import WordToPdfTool from "../../components/user/tools/implementations/WordToPdfTool";
import PdfMergeTool from "../../components/user/tools/implementations/PdfMergeTool";
import UrlShortenerTool from "../../components/user/tools/implementations/UrlShortenerTool";
import WordCounterTool from "../../components/user/tools/implementations/WordCounterTool";
import UuidGeneratorTool from "../../components/user/tools/implementations/UuidGeneratorTool";
import ImageCompressorTool from "../../components/user/tools/implementations/ImageCompressorTool";

/**
 * Main User Tools Suite Page.
 *
 * HOW IT WORKS:
 * 1. On page load (/user/tools), it hits GET /api/users/tools-suite.
 * 2. It parses and deduplicates categories (Image Tools, Productivity Tools, PDF Tools)
 *    and displays them as sleek folder cards.
 * 3. Clicking a category folder opens a modal which hits GET /api/users/sub-tools-suite?toolId={toolId}.
 * 4. Clicking a tool in the modal navigates to its dedicated page (/user/tools/{toolSlug}).
 * 5. On the tool page, the interactive controller runs (QR Code, PDF Compressor, etc.)
 *    with complete backend integration.
 */
const UserTools = () => {
    const { toolSlug } = useParams();
    const navigate = useNavigate();

    // Suite Categories state
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    // Modal state for viewing sub-tools
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    /**
     * Fetch all tool categories from the backend tools-suite endpoint on mount.
     */
    useEffect(() => {
        let isMounted = true;

        const fetchCategories = async () => {
            setLoading(true);
            try {
                // Hits GET /api/users/tools-suite
                const response = await getToolsSuite();
                const rawDetails = response?.data || response?.details || [];

                if (Array.isArray(rawDetails) && rawDetails.length > 0) {
                    /**
                     * Deduplicate categories:
                     * The backend query returns multiple records for each category.
                     * We group by toolId and count the number of tools in each category.
                     */
                    const categoryMap = new Map();

                    rawDetails.forEach((item) => {
                        const id = item.toolId || item.id;
                        const name = item.toolCategory || item.tools_category || item.category;

                        if (!categoryMap.has(id)) {
                            categoryMap.set(id, {
                                toolId: id,
                                toolCategory: name,
                                toolCount: 1,
                            });
                        } else {
                            categoryMap.get(id).toolCount += 1;
                        }
                    });

                    if (isMounted) {
                        setCategories(Array.from(categoryMap.values()));
                    }
                } else {
                    // Fallback to default categories if response is empty
                    if (isMounted) {
                        setCategories(Object.values(CATEGORY_METADATA).map(c => ({
                            toolId: c.id,
                            toolCategory: c.title,
                            toolCount: c.id === 3 ? 5 : 3,
                        })));
                    }
                }
            } catch (err) {
                console.warn("Could not load categories from API, using default suite:", err);
                // Graceful fallback to default categories so UI remains accessible
                if (isMounted) {
                    setCategories(Object.values(CATEGORY_METADATA).map(c => ({
                        toolId: c.id,
                        toolCategory: c.title,
                        toolCount: c.id === 3 ? 5 : 3,
                    })));
                }
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        fetchCategories();

        return () => {
            isMounted = false;
        };
    }, []);

    // Filter categories by search term
    const filteredCategories = useMemo(() => {
        if (!searchTerm.trim()) return categories;
        const term = searchTerm.toLowerCase();
        return categories.filter((c) =>
            (c.toolCategory || "").toLowerCase().includes(term)
        );
    }, [categories, searchTerm]);

    // Handle opening folder modal
    const handleOpenFolder = (cat) => {
        setSelectedCategory(cat);
        setIsModalOpen(true);
    };

    // Handle tool selection from modal
    const handleSelectTool = (tool) => {
        setIsModalOpen(false);
        if (tool.slug) {
            navigate(`/user/tools/${tool.slug}`);
        }
    };

    // Handle going back to the main suite view
    const handleBackToSuite = () => {
        navigate("/user/tools");
    };

    // =========================================================================
    // 1. RENDER ACTIVE TOOL VIEW (when toolSlug is in URL, e.g. /user/tools/qr-code)
    // =========================================================================
    if (toolSlug) {
        const currentTool = TOOLS_CATALOG[toolSlug];

        if (!currentTool) {
            return (
                <div className="w-full max-w-4xl mx-auto py-12 text-center">
                    <h2 className="text-xl font-bold text-white mb-2">Tool Not Found</h2>
                    <p className="text-sm text-slate-400 mb-6">
                        The requested tool "{toolSlug}" does not exist in the DevToolBox suite.
                    </p>
                    <button
                        onClick={handleBackToSuite}
                        className="px-4 py-2 rounded-xl bg-cyan-500 text-white font-semibold text-xs"
                    >
                        Return to Tool Suite
                    </button>
                </div>
            );
        }

        return (
            <ToolPageWrapper
                tool={currentTool}
                categoryName={currentTool.categoryName}
                onBack={handleBackToSuite}
            >
                {/* Dynamically render the respective tool controller */}
                {toolSlug === "image-compressor" && <ImageCompressorTool tool={currentTool} />}
                {toolSlug === "url-shortener" && <UrlShortenerTool tool={currentTool} />}
                {toolSlug === "qr-code" && <QrCodeTool tool={currentTool} />}
                {toolSlug === "uuid-generator" && <UuidGeneratorTool tool={currentTool} />}
                {toolSlug === "word-counter" && <WordCounterTool tool={currentTool} />}
                {toolSlug === "pdf-compressor" && <PdfCompressorTool tool={currentTool} />}
                {toolSlug === "image-to-pdf" && <ImageToPdfTool tool={currentTool} />}
                {toolSlug === "word-to-pdf" && <WordToPdfTool tool={currentTool} />}
                {toolSlug === "pdf-merge" && <PdfMergeTool tool={currentTool} />}
            </ToolPageWrapper>
        );
    }

    // =========================================================================
    // 2. RENDER MAIN TOOL SUITE VIEW (Categories Grid + Modal)
    // =========================================================================
    return (
        <div className="w-full flex flex-col gap-6 sm:gap-8 pb-12 max-w-7xl mx-auto animate-in fade-in duration-200">
            {/* Top Bar: Search & Status Header */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                <div className="h-11 w-full max-w-full sm:max-w-md rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center px-3.5 gap-2.5 shadow-sm">
                    <Search size={18} className="text-cyan-400 shrink-0" />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search tool folders (e.g., PDF, Productivity, Image)..."
                        className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-400"
                    />
                    {searchTerm && (
                        <button
                            onClick={() => setSearchTerm("")}
                            className="text-xs text-slate-400 hover:text-white"
                        >
                            Clear
                        </button>
                    )}
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto">
                    <span className="text-xs text-slate-400 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800">
                        <FolderTree size={14} className="text-cyan-400" />
                        <span>{filteredCategories.length} Categories</span>
                    </span>
                </div>
            </div>

            {/* Intro Welcome Banner */}
            <div className="relative overflow-hidden rounded-3xl border border-cyan-500/20 bg-gradient-to-r from-[#0B1528] via-[#091122] to-[#070D1B] p-6 sm:p-8 shadow-xl shadow-cyan-950/20">
                <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
                                <Sparkles size={11} />
                                User Workspace
                            </span>
                        </div>
                        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight">
                            DevToolBox{" "}
                            <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-400 bg-clip-text text-transparent">
                                Tool Suite
                            </span>
                        </h1>
                        <p className="mt-2 text-xs sm:text-sm md:text-base text-slate-300 max-w-2xl leading-relaxed">
                            Select a tool category folder below to browse sub-tools and launch dedicated utilities including QR Code Generator, PDF Compressor, Image to PDF, Word to PDF, and PDF Merger.
                        </p>
                    </div>

                    <div className="shrink-0 flex items-center gap-3">
                        <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700/80 flex items-center gap-3">
                            <Boxes size={28} className="text-cyan-400" />
                            <div>
                                <p className="text-xs text-slate-400">Integrated Tools</p>
                                <p className="text-base font-bold text-white">5 Active Controllers</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Category Folders Grid */}
            <div className="w-full">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                            <Folder size={18} className="text-cyan-400" />
                            Tool Categories
                        </h2>
                        <p className="text-xs text-slate-400 mt-0.5">
                            Click any category folder to inspect its sub-tools.
                        </p>
                    </div>
                </div>

                {loading ? (
                    <div className="py-20 flex flex-col items-center justify-center gap-3">
                        <Loader2 size={36} className="animate-spin text-cyan-400" />
                        <p className="text-sm text-slate-400">Loading Tool Suite from server...</p>
                    </div>
                ) : filteredCategories.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
                        {filteredCategories.map((cat) => (
                            <ToolCategoryCard
                                key={cat.toolId}
                                category={cat}
                                onOpenModal={handleOpenFolder}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="rounded-2xl border border-dashed border-slate-800 p-12 text-center text-slate-400">
                        <Search size={32} className="mx-auto mb-3 text-slate-600" />
                        <p className="text-base font-semibold text-white">No categories found</p>
                        <p className="text-xs text-slate-500 mt-1">Try another search keyword.</p>
                    </div>
                )}
            </div>

            {/* Sub-tools Modal */}
            <SubToolsModal
                isOpen={isModalOpen}
                category={selectedCategory}
                onClose={() => setIsModalOpen(false)}
                onSelectTool={handleSelectTool}
            />
        </div>
    );
};

export default UserTools;
