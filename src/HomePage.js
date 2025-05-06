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
    <div>
      <h1 style={{ fontSize: "6vw", textAlign: "center" }}>
        空腹スコア・ダイエット
      </h1>
      <p style={{ textAlign: "center", fontSize: "4vw" }}>
        今日のスコア: {todayScore} / <strong>{goal}</strong> 点目標
      </p>

      {/* スコア記録ボタン（中央下部） */}
      <div className="floating-buttons">
        <button onClick={() => addScore(1)} style={{ fontSize: "5vw" }}>
          ★☆☆
        </button>
        <button onClick={() => addScore(2)} style={{ fontSize: "5vw" }}>
          ★★☆
        </button>
        <button onClick={() => addScore(3)} style={{ fontSize: "5vw" }}>
          ★★★
        </button>
      </div>
    </div>
  );
}
