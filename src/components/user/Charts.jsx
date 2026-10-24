
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

const SimpleBarChart = ({ days = [], usages = [], month = "" }) => {

    const chartData = days.map((day, index) => ({
        day,
        usage: usages[index] ?? 0,
    }));

    return (
        <div className="w-full rounded-xl bg-slate-800 p-5 shadow">
            <h2 className="mb-1 text-xl font-semibold text-white">
                API Usage Analytics
            </h2>

            <p className="mb-5 text-sm text-slate-400">
                Daily API requests for {month}
            </p>

            <ResponsiveContainer width="100%" height={280}>
                <BarChart
                    data={chartData}
                    margin={{ top: 10, right: 10, left: 0, bottom: 5 }}
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
                        tick={{ fill: "#cbd5e1" }}
                        label={{
                            value: "Day of Month",
                            position: "insideBottom",
                            offset: -2,
                            fill: "#cbd5e1",
                        }}
                    />

                    <YAxis
                        tickLine={false}
                        axisLine={false}
                        allowDecimals={false}
                        tick={{ fill: "#cbd5e1" }}
                    />

                    <Tooltip
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
                        maxBarSize={40}
                    />
                </BarChart>
            </ResponsiveContainer>

            {chartData.length === 0 && (
                <p className="mt-3 text-center text-sm text-slate-400">
                    No API usage recorded for {month} yet.
                </p>
            )}
        </div>
    );
};

export default SimpleBarChart;
