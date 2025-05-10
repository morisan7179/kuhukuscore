import React, { useState, useEffect } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid,
} from "recharts";

export default function HistoryPage() {
  const [scores, setScores] = useState([]);
  const [darkMode, setDarkMode] = useState(() => {
    return JSON.parse(localStorage.getItem("darkMode")) || false;
  });
  const [reverse, setReverse] = useState(false);
　
  const loadScores = () => {
    setScores(JSON.parse(localStorage.getItem("scores") || "[]"));
  };

  useEffect(() => {
    loadScores();
    window.addEventListener("focus", loadScores);
    return () => window.removeEventListener("focus", loadScores);
  }, []);

  const grouped = scores.reduce((acc, entry) => {
    const date = entry.date;
    if (!acc[date]) acc[date] = { date, total: 0, entries: [] };
    acc[date].total += entry.score;
    acc[date].entries.push(entry);
    return acc;
  }, {});

  const sortedDates = Object.keys(grouped).sort((a, b) =>
    reverse ? a.localeCompare(b) : b.localeCompare(a)
  );

  const dailyTotals = sortedDates.map((date) => ({
    date,
    total: grouped[date].total,
  }));

  const handleClear = () => {
    if (window.confirm("本当に全ての記録を削除しますか？")) {
      localStorage.removeItem("scores");
      localStorage.removeItem("total");
      localStorage.removeItem("todayScore");
      localStorage.removeItem("lastRecordedDate");
      setScores([]);
    }
  };

  const bg = darkMode ? "#121212" : "#fff";
  const text = darkMode ? "#f0f0f0" : "#000";
  const box = darkMode ? "#1e1e1e" : "#f9f9f9";

  return (
    <div style={{ backgroundColor: bg, color: text, padding: "5vw", maxWidth: "90vw", margin: "auto", minHeight: "100vh", paddingBottom: "100px" }}>
      <h1 style={{ fontSize: "6vw", textAlign: "center" }}>📅 記録履歴</h1>

      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
        <button onClick={() => setReverse(!reverse)} style={{ fontSize: "4vw", padding: "10px" }}>{reverse ? "🔽 古い順" : "🔼 新しい順"}</button>
        <button onClick={handleClear} style={{ fontSize: "4vw", padding: "10px", background: "#ff6666", color: "white" }}>🧹 全削除</button>
      </div>

      <div style={{ marginBottom: "30px" }}>
        <h2 style={{ fontSize: "5vw" }}>📈 日別スコア合計</h2>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={dailyTotals}>
            <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "#444" : "#ccc"} />
            <XAxis dataKey="date" stroke={text} />
            <YAxis allowDecimals={false} stroke={text} />
            <Tooltip contentStyle={{ backgroundColor: box, color: text }} labelStyle={{ color: text }} itemStyle={{ color: text }} />
            <Bar dataKey="total" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {sortedDates.length === 0 ? (
        <p style={{ fontSize: "4vw" }}>記録がありません。</p>
      ) : (
        sortedDates.map((date) => (
          <div key={date} style={{ marginBottom: "20px", background: box, padding: "15px", borderRadius: "8px" }}>
            <h2 style={{ fontSize: "5vw", marginBottom: "10px" }}>{date}</h2>
            {grouped[date].entries.map((entry, i) => (
              <p key={i} style={{ fontSize: "4vw" }}>
                [{entry.time}] {"★".repeat(entry.score)}（{entry.score}点）
              </p>
            ))}
          </div>
        ))
      )}
    </div>
  );
}
