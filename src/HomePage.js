import React, { useState, useEffect } from "react";

export default function HomePage() {
  const [scores, setScores] = useState(() => {
    try {
      const saved = localStorage.getItem("scores");
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error("scores の読み込みに失敗:", e);
      return [];
    }
  });

  const [goal, setGoal] = useState(() => {
    const savedGoal = localStorage.getItem("goal");
    return savedGoal ? Number(savedGoal) : 300;
  });

  const [total, setTotal] = useState(() => {
    const savedTotal = localStorage.getItem("total");
    return savedTotal ? Number(savedTotal) : 0;
  });

  const [todayScore, setTodayScore] = useState(() => {
    const savedToday = localStorage.getItem("todayScore");
    return savedToday ? Number(savedToday) : 0;
  });

  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem("darkMode");
    return savedMode ? JSON.parse(savedMode) : false;
  });

  const maxDays = 30;

  const getTodayJST = () => {
    const now = new Date();
    const jst = new Date(
      now.getTime() + now.getTimezoneOffset() * 60000 + 9 * 3600000
    );
    const yyyy = jst.getFullYear();
    const mm = String(jst.getMonth() + 1).padStart(2, "0");
    const dd = String(jst.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };

  useEffect(() => {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - maxDays + 1);

    const filtered = scores.filter((entry) => {
      const entryDate = new Date(entry.date);
      return entryDate >= cutoff;
    });

    if (filtered.length !== scores.length) {
      setScores(filtered);
      localStorage.setItem("scores", JSON.stringify(filtered));
    }

    const todayDate = getTodayJST();
    const savedDate = localStorage.getItem("lastRecordedDate");
    if (savedDate !== todayDate) {
      setTodayScore(0);
      localStorage.setItem("lastRecordedDate", todayDate);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("test", "1");
      const test = localStorage.getItem("test");
      if (test !== "1") {
        console.warn("localStorage 書き込み確認に失敗");
        return;
      }

      localStorage.setItem("goal", goal);
      localStorage.setItem("total", total);
      localStorage.setItem("todayScore", todayScore);
      localStorage.setItem("darkMode", JSON.stringify(darkMode));
      localStorage.setItem("scores", JSON.stringify(scores));
    } catch (e) {
      console.error("localStorage 保存に失敗:", e);
    }
  }, [scores, goal, total, todayScore, darkMode]);

  const addScore = (score) => {
    const newTotal = total + score;
    const now = new Date();

    const jstDate = getTodayJST();

    const newScores = [
      ...scores,
      {
        time: now.toLocaleTimeString("ja-JP"),
        score,
        date: jstDate,
      },
    ];
    setScores(newScores);
    setTotal(newTotal);
    setTodayScore(todayScore + score);
    localStorage.setItem("lastRecordedDate", jstDate);
  };

  const deleteEntry = (indexToDelete) => {
    const entryToDelete = scores[indexToDelete];
    const newScores = scores.filter((_, i) => i !== indexToDelete);
    setScores(newScores);
    setTotal(total - entryToDelete.score);
    if (entryToDelete.date === getTodayJST()) {
      setTodayScore(todayScore - entryToDelete.score);
    }
  };

  const totalToday = scores
    .filter((e) => e.date === getTodayJST())
    .reduce((sum, entry) => sum + (Number(entry.score) || 0), 0);

  const backgroundColor = darkMode ? "#121212" : "#ffffff";
  const textColor = darkMode ? "#f0f0f0" : "#000000";
  const boxColor = darkMode ? "#1e1e1e" : "#f9f9f9";

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
      <h1 style={{ fontSize: "6vw", textAlign: "center" }}>
        空腹スコア・ダイエット
      </h1>

      <div style={{ textAlign: "right", marginBottom: "10px" }}>
        <span
          onClick={() => setDarkMode(!darkMode)}
          style={{
            fontSize: "5vw",
            cursor: "pointer",
            userSelect: "none",
          }}
        >
          {darkMode ? "☀️" : "🌙"}
        </span>
      </div>

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

      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          background: backgroundColor,
          borderTop: darkMode ? "1px solid #444" : "1px solid #ccc",
          padding: "20px 10px",
          minHeight: "70px",
          display: "flex",
          justifyContent: "center",
          gap: "10px",
          zIndex: 1000,
        }}
      >
        <button onClick={() => addScore(1)} style={{ fontSize: "6vw" }}>
          ★☆☆
        </button>
        <button onClick={() => addScore(2)} style={{ fontSize: "6vw" }}>
          ★★☆
        </button>
        <button onClick={() => addScore(3)} style={{ fontSize: "6vw" }}>
          ★★★
        </button>
      </div>
    </div>
  );
}
