import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

export default function ProgressPage() {
  const [scores, setScores] = useState([]);
  const [monthlyGoal, setMonthlyGoal] = useState(300);
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem("darkMode");
    return savedMode ? JSON.parse(savedMode) : false;
  });

  const fetchScores = () => {
    const saved = localStorage.getItem("scores");
    const savedGoal = localStorage.getItem("monthlyGoal");
    if (saved) setScores(JSON.parse(saved));
    if (savedGoal) setMonthlyGoal(Number(savedGoal));
  };

  useEffect(() => {
    fetchScores();
    window.addEventListener("focus", fetchScores);
    return () => {
      window.removeEventListener("focus", fetchScores);
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchScores();
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const thisMonth = new Date().toISOString().slice(0, 7);
  const monthlyTotal = scores
    .filter((entry) => {
      const jstDate = new Date(entry.date);
      jstDate.setHours(jstDate.getHours() + 9);
      return jstDate.toISOString().startsWith(thisMonth);
    })
    .reduce((sum, entry) => sum + entry.score, 0);

  const progress = Math.min(monthlyTotal / monthlyGoal, 1);

  const pieData = [
    { name: "達成", value: progress },
    { name: "残り", value: 1 - progress },
  ];

  const COLORS = ["#00C49F", "#eeeeee"];

  const dailyTotals = Object.values(
    scores.reduce((acc, { date, score }) => {
      const jstDate = new Date(date);
      jstDate.setHours(jstDate.getHours() + 9);
      const jstDateStr = jstDate.toISOString().split("T")[0];

      if (!acc[jstDateStr]) acc[jstDateStr] = { date: jstDateStr, total: 0 };
      acc[jstDateStr].total += score;
      return acc;
    }, {})
  ).sort((a, b) => a.date.localeCompare(b.date));

  const backgroundColor = darkMode ? "#121212" : "#ffffff";
  const textColor = darkMode ? "#f0f0f0" : "#000000";
  const boxColor = darkMode ? "#1e1e1e" : "#f9f9f9";

  return (
    <div
      style={{
        backgroundColor,
        color: textColor,
        padding: "5vw",
        maxWidth: "90vw",
        margin: "auto",
        textAlign: "center",
        paddingBottom: "100px",
        minHeight: "100vh",
      }}
    >
      <h1 style={{ fontSize: "6vw" }}>📊 月間進捗</h1>

      <PieChart width={200} height={200}>
        <Pie
          data={pieData}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={80}
          startAngle={90}
          endAngle={-270}
          dataKey="value"
        >
          {pieData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index]} />
          ))}
        </Pie>
      </PieChart>

      <p style={{ fontSize: "4vw" }}>
        今月の達成率: {(progress * 100).toFixed(1)}%
      </p>
      <p style={{ fontSize: "4vw" }}>
        あと {Math.max(monthlyGoal - monthlyTotal, 0)} 点で目標達成！
      </p>

      <div style={{ marginTop: "40px" }}>
        <h2 style={{ fontSize: "5vw" }}>日別スコア推移グラフ</h2>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={dailyTotals}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={darkMode ? "#444" : "#ccc"}
            />
            <XAxis dataKey="date" stroke={textColor} />
            <YAxis allowDecimals={false} stroke={textColor} />
            <Tooltip
              contentStyle={{ backgroundColor: boxColor, color: textColor }}
              labelStyle={{ color: textColor }}
              itemStyle={{ color: textColor }}
            />
            <Line
              type="monotone"
              dataKey="total"
              stroke="#8884d8"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
