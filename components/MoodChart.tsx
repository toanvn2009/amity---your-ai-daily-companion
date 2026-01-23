import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { MoodRecord } from "../types";

interface MoodChartProps {
  data: MoodRecord[];
}

const moodValues = {
  happy: 5,
  excited: 5,
  neutral: 3,
  tired: 2,
  anxious: 1,
  sad: 0,
};

const MoodChart: React.FC<MoodChartProps> = ({ data }) => {
  const chartData = data.slice(-7).map((item) => ({
    timestamp: item.timestamp,
    value: moodValues[item.mood] || 3,
    mood: item.mood,
    day: format(new Date(item.timestamp), "dd/MM", { locale: vi }),
  }));

  if (data.length < 1) {
    return (
      <div className="bg-white/60 border border-white/60 rounded-2xl p-6 shadow-sm backdrop-blur-sm">
        <h3 className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-2">
          <span className="text-rose-500">💓</span> Nhịp đập cảm xúc
        </h3>
        <div className="h-32 flex flex-col items-center justify-center text-center gap-3 border border-dashed border-slate-200 rounded-xl bg-gradient-to-b from-indigo-50/50 to-white/50">
          <span className="text-3xl">📊</span>
          <p className="text-slate-500 text-sm">Chưa có dữ liệu cảm xúc nào</p>
          <p className="text-slate-400 text-xs max-w-xs">
            💡 Hãy chia sẻ cảm xúc với Amity để mình theo dõi tâm trạng của bạn
            nhé!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/60 border border-white/60 rounded-2xl p-4 shadow-sm backdrop-blur-sm">
      <h3 className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-2">
        <span className="text-rose-500">💓</span> Nhịp đập cảm xúc (
        {Math.min(chartData.length, 7)} bản ghi)
      </h3>
      <div className="h-48 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorMood" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#818cf8" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#818cf8" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#e2e8f0"
            />
            <XAxis
              dataKey="day"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#94a3b8", fontSize: 10 }}
              dy={10}
            />
            <YAxis hide domain={[0, 6]} />
            <Tooltip
              contentStyle={{
                borderRadius: "12px",
                border: "none",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              }}
              cursor={{ stroke: "#818cf8", strokeWidth: 2 }}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#6366f1"
              fillOpacity={1}
              fill="url(#colorMood)"
              strokeWidth={3}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default MoodChart;
