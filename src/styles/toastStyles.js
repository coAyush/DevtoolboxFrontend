export const base = {
    background: "rgba(15, 23, 42, 0.85)", // slate-900, thoda transparent (blur ke liye zaroori)
    color: "#e2e8f0",                      // slate-200, readable on dark
    backdropFilter: "blur(12px)",
    WebkitBackdropFilter: "blur(12px)",    // Safari support
    borderRadius: "14px",
    padding: "12px 16px",
    minWidth: "300px",
    fontSize: "14px",
    fontWeight: 500,
};

// Helper: accent color se border + glow banata hai
export const accent = (rgb) => ({
    border: `1px solid rgba(${rgb}, 0.45)`,
    boxShadow: `0 8px 30px rgba(0,0,0,0.5), 0 0 24px rgba(${rgb}, 0.25)`,
});

