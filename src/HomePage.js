import React, { useState, useEffect } from "react";

export default function HomePage() {
  const [goal, setGoal] = useState(() => {
    const savedGoal = localStorage.getItem("goal");
    return savedGoal ? Number(savedGoal) : 300;
  });

  const [scores, setScores] = useState(() => {
    const saved = localStorage.getItem("scores");
    return saved ? JSON.parse(saved) : [];
  });

  const [total, setTotal] = useState(() => {
    const saved = localStorage.getItem("total");
    return saved ? Number(saved) : 0;
  });

  const [todayScore, setTodayScore] = useState(() => {
    const savedToday = localStorage.getItem("todayScore");
    return savedToday ? Number(savedToday) : 0;
  });

  useEffect(() => {
    localStorage.setItem("scores", JSON.stringify(scores));
    localStorage.setItem("goal", goal);
    localStorage.setItem("total", total);
    localStorage.setItem("todayScore", todayScore);
  }, [scores, goal, total, todayScore]);

  const addScore = (score) => {
    const now = new Date();
    const dateStr = now.toISOString().split("T")[0];
    const newEntry = {
      time: now.toLocaleTimeString("ja-JP"),
      score,
      date: dateStr,
    };
    setScores([...scores, newEntry]);
    setTotal(total + score);
    setTodayScore(todayScore + score);
  };

  return (

    <div
      style={{
        backgroundColor,
        color: textColor,
        minHeight: "100vh",
        padding: "5vw",
        maxWidth: "90vw",
        margin: "auto",
        paddingBottom: "100px",
      }}
    >
      {/* タイトル + ダークモード切り替え */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <h1
          style={{
            margin: 0,
            fontSize: "min(5vw, 28px)",
            whiteSpace: "nowrap",
          }}
        >
          空腹スコア・ダイエット
        </h1>

        <button
          onClick={() => setDarkMode(!darkMode)}
          style={{
            fontSize: "min(6vw, 32px)",
            background: "none",
            border: "none",
            cursor: "pointer",
          }}
          aria-label="ダークモード切り替え"
        >
          {darkMode ? "🌞" : "🌙"}
        </button>
      </div>

      {/* 今日の記録 */}
      <div
        style={{
          marginBottom: "20px",
          background: boxColor,
          padding: "15px",
          borderRadius: "8px",
        }}
      >
        <h2 style={{ fontSize: "5vw" }}>今日の記録（合計: {totalToday}点）</h2>
        {scores.length === 0 ? (
          <p style={{ fontSize: "4vw" }}>まだ記録がありません。</p>
        ) : (
          scores.map((entry, index) => (
            <p key={index} style={{ fontSize: "4vw" }}>
              [{entry.time}] {"★".repeat(entry.score)}（{entry.score}点）
              <button
                onClick={() => deleteEntry(index)}
                style={{
                  marginLeft: "10px",
                  fontSize: "3.5vw",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                }}
                aria-label="削除"
              >
                🗑️
              </button>
            </p>
          ))
        )}
      </div>

      {/* 目標設定 */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "10px",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <label style={{ fontSize: "4vw" }}>目標：</label>
        <input
          type="number"
          value={goal}
          onChange={(e) => setGoal(Number(e.target.value))}
          placeholder="目標スコアを入力"
          style={{ padding: "10px", fontSize: "4vw", width: "40vw" }}
        />
      </div>

      {/* スコア追加ボタン */}
      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          background: backgroundColor,
          borderTop: darkMode ? "1px solid #444" : "1px solid #ccc",
          padding: "20px 10px",
          display: "flex",
          justifyContent: "center",
          gap: "20px",
          zIndex: 1000,
        }}
      >
        <button
          onClick={() => addScore(1)}
          style={{ fontSize: "4vw", padding: "10px 15px" }}
        >
          ★☆☆
        </button>
        <button
          onClick={() => addScore(2)}
          style={{ fontSize: "4vw", padding: "10px 15px" }}
        >
          ★★☆
        </button>
        <button
          onClick={() => addScore(3)}
          style={{ fontSize: "4vw", padding: "10px 15px" }}
        >
          ★★★
        </button>
      </div>
    </div>
  );
}
