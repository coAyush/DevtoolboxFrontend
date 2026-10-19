import { useState, useEffect } from "react";
import { useRevalidator, useRouteError } from "react-router";

const ERROR_PRESETS = {
    500: {
        code: "500",
        title: "Internal Server Error",
        badge: "HTTP 500: UNHANDLED_EXCEPTION",
        summary: "The server encountered an unexpected error.",
        exception: "InternalServerError",
        rootCause: "An unexpected server-side failure occurred.",
        serviceImpacted: "core-api"
    },
    502: {
        code: "502",
        title: "Bad Gateway",
        badge: "HTTP 502: BAD_GATEWAY_UPSTREAM",
        summary: "The upstream server returned an invalid response.",
        exception: "UpstreamProtocolViolation",
        rootCause: "The gateway received an invalid upstream response.",
        serviceImpacted: "api-gateway"
    },
    503: {
        code: "503",
        title: "Service Temporarily Unavailable",
        badge: "HTTP 503: SERVICE_UNAVAILABLE",
        summary: "The server is temporarily unavailable.",
        exception: "ServiceUnavailable",
        rootCause: "The service may be overloaded or under maintenance.",
        serviceImpacted: "core-api"
    },
    504: {
        code: "504",
        title: "Gateway Timeout",
        badge: "HTTP 504: UPSTREAM_TIMEOUT",
        summary: "The server did not respond in time.",
        exception: "GatewayTimeout",
        rootCause: "The upstream request timed out.",
        serviceImpacted: "api-gateway"
    }
};

export const ServerError = () => {
    const error = useRouteError();
    const revalidator = useRevalidator();

    const [selectedStatus, setSelectedStatus] = useState(500);
    const [activeTab, setActiveTab] = useState("stacktrace");
    const [showDiagnostics, setShowDiagnostics] = useState(false);
    const [copiedType, setCopiedType] = useState(null);
    const [requestId, setRequestId] = useState("");
    const [rayId, setRayId] = useState("");
    const [timestamp, setTimestamp] = useState("");

    // Axios error, React Router error, or network failure.
    const errorcode =
        error?.response?.status ??
        error?.status ??
        error?.serverError?.status ??
        500;

    console.log("Error code:", errorcode);
    console.log("Full error:", error);

    // Use the actual error code, falling back to 500.
    const currentError =
        error?.serverError ??
        ERROR_PRESETS[errorcode] ??
        ERROR_PRESETS[500];

    useEffect(() => {
        setRequestId(`req_${Math.random().toString(16).slice(2, 12)}`);
        setRayId(`${Math.random().toString(16).slice(2, 10).toUpperCase()}-IAD`);
        setTimestamp(new Date().toISOString());
    }, []);

    const handleCopy = async (text, type) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopiedType(type);
        } catch (copyError) {
            console.error("Copy failed:", copyError);
        }
    };

    const handleRetry = () => {
        if (revalidator.state !== "loading") {
            revalidator.revalidate();
        }
    };

    return (
        <main className="min-h-screen bg-[#090b10] text-slate-100 flex flex-col items-center justify-center p-6">
            <div className="text-center space-y-4">
                <p className="text-rose-400 font-mono">
                    {currentError.badge}
                </p>

                <h1 className="text-8xl font-black font-mono">
                    {currentError.code}
                </h1>

                <h2 className="text-3xl font-bold">
                    {currentError.title}
                </h2>

                <p className="max-w-xl text-slate-400">
                    {currentError.summary}
                </p>

                <button
                    onClick={handleRetry}
                    disabled={revalidator.state === "loading"}
                    className="rounded-lg bg-rose-600 px-5 py-3 disabled:opacity-50"
                >
                    {revalidator.state === "loading"
                        ? "Retrying..."
                        : "Retry Request"}
                </button>

                <button
                    onClick={() => setShowDiagnostics(!showDiagnostics)}
                    className="ml-3 rounded-lg border border-slate-700 px-5 py-3"
                >
                    {showDiagnostics ? "Hide Diagnostics" : "Show Diagnostics"}
                </button>
            </div>

            {showDiagnostics && (
                <section className="mt-8 w-full max-w-xl rounded-lg border border-slate-800 bg-slate-950 p-5">
                    <p>Exception: {currentError.exception}</p>
                    <p>Service: {currentError.serviceImpacted}</p>
                    <p>Request ID: {requestId}</p>
                    <p>Ray ID: {rayId}</p>
                    <p>Timestamp: {timestamp}</p>

                    <button
                        onClick={() =>
                            handleCopy(
                                JSON.stringify(currentError, null, 2),
                                "diagnostics"
                            )
                        }
                        className="mt-4 rounded bg-slate-800 px-4 py-2"
                    >
                        {copiedType === "diagnostics" ? "Copied!" : "Copy Diagnostics"}
                    </button>
                </section>
            )}
        </main>
    );
};