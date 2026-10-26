
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

/**
 * RESPONSIVE RECHARTS TIP:
 * 1. `ResponsiveContainer` requires its parent to have a clearly bounded width.
 *    Always give the parent `w-full min-w-0` to avoid flex child overflow bugs.
 * 2. On mobile screens, 30-31 daily ticks on the X-axis will collide and become unreadable.
 *    Using `interval="preserveStartEnd"` or `minTickGap={10}` lets Recharts intelligently
 *    hide overlapping labels on narrow screens.
 * 3. Use responsive heights (e.g., `height={240}` on mobile, `height={280}` on desktop).
 */
const SimpleBarChart = ({ days = [], usages = [], month = "" }) => {

    const chartData = days.map((day, index) => ({
        day,
        usage: usages[index] ?? 0,
    }));

    return (
        <div className="w-full min-w-0 rounded-2xl bg-slate-800/80 border border-slate-700/60 p-4 sm:p-5 shadow-lg">
            <h2 className="mb-1 text-lg sm:text-xl font-semibold text-white">
                API Usage Analytics
            </h2>

            <p className="mb-4 sm:mb-5 text-xs sm:text-sm text-slate-400">
                Daily API requests for {month}
            </p>

            <div className="w-full h-[240px] sm:h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={chartData}
                        margin={{ top: 10, right: 10, left: -15, bottom: 5 }}
                    >
                        <CartesianGrid
                            strokeDasharray="3 3"
                            vertical={false}
                            stroke="#475569"
                        />

                        <XAxis
                            dataKey="day"
                            tickLine={false}
                            axisLine={false}
                            tick={{ fill: "#cbd5e1", fontSize: 11 }}
                            minTickGap={12}
                            interval="preserveStartEnd"
                        />

                        <YAxis
                            tickLine={false}
                            axisLine={false}
                            allowDecimals={false}
                            tick={{ fill: "#cbd5e1", fontSize: 11 }}
                        />

                        <Tooltip
                            contentStyle={{
                                backgroundColor: "#0f172a",
                                borderColor: "#334155",
                                borderRadius: "8px",
                                color: "#f8fafc",
                                fontSize: "12px",
                            }}
                            formatter={(value) => [
                                `${value} requests`,
                                "API Usage",
                            ]}
                            labelFormatter={(label) => `Day ${label}`}
                        />

                        <Bar
                            dataKey="usage"
                            name="API Requests"
                            fill="#22d3ee"
                            radius={[6, 6, 0, 0]}
                            maxBarSize={32}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {chartData.length === 0 && (
                <p className="mt-3 text-center text-xs sm:text-sm text-slate-400">
                    No API usage recorded for {month} yet.
                </p>
            )}
        </div>
    );
};

export default SimpleBarChart;
