import React, { useState, useEffect } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell,
} from "recharts";

export default function ProgressPage() {
  const [scores, setScores] = useState([]);
  const [monthlyGoal, setMonthlyGoal] = useState(300);
  const [darkMode, setDarkMode] = useState(() => {
    return JSON.parse(localStorage.getItem("darkMode")) || false;
  });

  const fetchScores = () => {
    setScores(JSON.parse(localStorage.getItem("scores") || "[]"));
    setMonthlyGoal(Number(localStorage.getItem("monthlyGoal")) || 300);
  };

  useEffect(() => {
    fetchScores();
    window.addEventListener("focus", fetchScores);
    return () => window.removeEventListener("focus", fetchScores);
  }, []);

  const thisMonth = new Date().toISOString().slice(0, 7);
  const monthlyTotal = scores
    .filter((entry) => new Date(entry.date).toISOString().startsWith(thisMonth))
    .reduce((sum, entry) => sum + entry.score, 0);

  const progress = Math.min(monthlyTotal / monthlyGoal, 1);
  const pieData = [
    { name: "達成", value: progress },
    { name: "残り", value: 1 - progress },
  ];
  const COLORS = ["#00C49F", "#eeeeee"];

  const dailyTotals = Object.values(
    scores.reduce((acc, { date, score }) => {
      if (!acc[date]) acc[date] = { date, total: 0 };
      acc[date].total += score;
      return acc;
    }, {})
  ).sort((a, b) => a.date.localeCompare(b.date));

  const bg = darkMode ? "#121212" : "#fff";
  const text = darkMode ? "#f0f0f0" : "#000";
  const box = darkMode ? "#1e1e1e" : "#f9f9f9";

  return (
    <div style={{ backgroundColor: bg, color: text, padding: "5vw", maxWidth: "90vw", margin: "auto", textAlign: "center", paddingBottom: "100px", minHeight: "100vh" }}>
      <h1 style={{ fontSize: "6vw" }}>📊 月間進捗</h1>

      <PieChart width={200} height={200}>
        <Pie data={pieData} cx="50%" cy="50%" innerRadius={40} outerRadius={80} startAngle={90} endAngle={-270} dataKey="value">
          {pieData.map((entry, index) => (<Cell key={`cell-${index}`} fill={COLORS[index]} />))}
        </Pie>
      </PieChart>

      <p style={{ fontSize: "4vw" }}>今月の達成率: {(progress * 100).toFixed(1)}%</p>
      <p style={{ fontSize: "4vw" }}>あと {Math.max(monthlyGoal - monthlyTotal, 0)} 点で目標達成！</p>

      <div style={{ marginTop: "40px" }}>
        <h2 style={{ fontSize: "5vw" }}>日別スコア推移グラフ</h2>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={dailyTotals}>
            <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "#444" : "#ccc"} />
            <XAxis dataKey="date" stroke={text} />
            <YAxis allowDecimals={false} stroke={text} />
            <Tooltip contentStyle={{ backgroundColor: box, color: text }} labelStyle={{ color: text }} itemStyle={{ color: text }} />
            <Line type="monotone" dataKey="total" stroke="#8884d8" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
