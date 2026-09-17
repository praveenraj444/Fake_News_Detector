import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, RadialBarChart, RadialBar } from "recharts";
import type { PredictionResponse } from "../types";

interface PredictionChartsProps {
  result: PredictionResponse;
}

const REAL_COLOR = "#22C55E";
const FAKE_COLOR = "#EF4444";

export default function PredictionCharts({ result }: PredictionChartsProps) {
  const pieData = [
    { name: "Real", value: result.real_probability },
    { name: "Fake", value: result.fake_probability },
  ];

  const confidenceData = [
    {
      name: "Confidence",
      value: result.confidence * 100,
      fill: result.prediction === "REAL" ? REAL_COLOR : FAKE_COLOR,
    },
  ];

  return (
    <div className="grid sm:grid-cols-2 gap-4 animate-fadeIn">
      <div className="bg-bg-panel border border-border rounded-2xl p-5">
        <h3 className="text-sm font-medium text-slate-300 mb-3">Probability Distribution</h3>
        <div className="h-52">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={80}
                paddingAngle={3}
                strokeWidth={0}
              >
                <Cell fill={REAL_COLOR} />
                <Cell fill={FAKE_COLOR} />
              </Pie>
              <Tooltip
                formatter={(value: number) => `${(value * 100).toFixed(1)}%`}
                contentStyle={{
                  backgroundColor: "#1A1F2B",
                  border: "1px solid #242A38",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
                itemStyle={{ color: "#E2E8F0" }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex items-center justify-center gap-6 mt-1 text-xs">
          <Legend color={REAL_COLOR} label={`Real ${(result.real_probability * 100).toFixed(1)}%`} />
          <Legend color={FAKE_COLOR} label={`Fake ${(result.fake_probability * 100).toFixed(1)}%`} />
        </div>
      </div>

      <div className="bg-bg-panel border border-border rounded-2xl p-5">
        <h3 className="text-sm font-medium text-slate-300 mb-3">Model Confidence</h3>
        <div className="h-52 relative">
          <ResponsiveContainer width="100%" height="100%">
            <RadialBarChart
              innerRadius="70%"
              outerRadius="100%"
              data={confidenceData}
              startAngle={90}
              endAngle={-270}
            >
              <RadialBar dataKey="value" cornerRadius={12} background={{ fill: "#242A38" }} />
            </RadialBarChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold text-slate-50">
              {result.confidence >= 0.995 ? "100" : (result.confidence * 100).toFixed(1)}%
            </span>
            <span className="text-[11px] text-slate-400">{result.prediction}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
      <span className="text-slate-400">{label}</span>
    </div>
  );
}
