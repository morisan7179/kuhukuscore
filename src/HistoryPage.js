import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export default function HistoryPage() {
  const [scores, setScores] = useState([]);
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem("darkMode");
    return savedMode ? JSON.parse(savedMode) : false;
  });
  const [reverse, setReverse] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("scores");
    if (saved) {
      setScores(JSON.parse(saved));
    }
  }, []);

  // 日付ごとにまとめて合計スコア算出
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
        minHeight: "100vh",
        paddingBottom: "100px",
      }}
    >
      <h1 style={{ fontSize: "6vw", textAlign: "center" }}>📅 記録履歴</h1>

      {/* 🔄 並び順切り替え・🧹 全削除 */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "20px",
        }}
      >
        <button
          onClick={() => setReverse(!reverse)}
          style={{ fontSize: "4vw", padding: "10px" }}
        >
          {reverse ? "🔽 古い順" : "🔼 新しい順"}
        </button>
        <button
          onClick={handleClear}
          style={{
            fontSize: "4vw",
            padding: "10px",
            background: "#ff6666",
            color: "white",
          }}
        >
          🧹 全削除
        </button>
      </div>

      {/* 📈 合計スコアグラフ */}
      <div style={{ marginBottom: "30px" }}>
        <h2 style={{ fontSize: "5vw" }}>📈 日別スコア合計</h2>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={dailyTotals}>
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
            <Bar dataKey="total" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* 🗂 記録リスト */}
      {sortedDates.length === 0 ? (
        <p style={{ fontSize: "4vw" }}>記録がありません。</p>
      ) : (
        sortedDates.map((date) => (
          <div
            key={date}
            style={{
              marginBottom: "20px",
              background: boxColor,
              padding: "15px",
              borderRadius: "8px",
            }}
          >
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
