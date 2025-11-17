import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

// PUBLIC_INTERFACE
export default function ProgressChart({ data }) {
  /** Renders a simple line chart of progress over time */
  const chartData = Array.isArray(data) ? data : [];
  return (
    <div className="h-64 w-full rounded-xl border border-gray-200 bg-white p-4">
      <div className="mb-2 text-sm font-medium text-gray-900">Learning Progress</div>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="label" stroke="#6b7280" />
          <YAxis domain={[0, 100]} stroke="#6b7280" />
          <Tooltip />
          <Line type="monotone" dataKey="percent" stroke="#2563EB" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
