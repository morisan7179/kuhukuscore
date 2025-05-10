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

  // ⭐ 新規追加：テーマ
  const themes = {
    light: { background: "#ffffff", text: "#000000", box: "#f9f9f9", font: "Arial, sans-serif" },
    dark: { background: "#121212", text: "#f0f0f0", box: "#1e1e1e", font: "Roboto, sans-serif" },
    blue: { background: "#e0f7fa", text: "#004d40", box: "#b2ebf2", font: "'Comic Sans MS', cursive, sans-serif" }
  };
  const [selectedTheme, setSelectedTheme] = useState(() => localStorage.getItem("theme") || "light");

  useEffect(() => localStorage.setItem("theme", selectedTheme), [selectedTheme]);

  const getTodayJST = () => new Date().toISOString().split("T")[0];
  const [selectedDate, setSelectedDate] = useState(getTodayJST);

  const maxDays = 30;

  useEffect(() => {
    const checkDateChange = () => {
      const todayDate = getTodayJST();
      const savedDate = localStorage.getItem("lastRecordedDate");
      if (savedDate !== todayDate) {
        setTodayScore(0);
        localStorage.setItem("lastRecordedDate", todayDate);
      }
    };
    checkDateChange();
    const intervalId = setInterval(checkDateChange, 60000);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - maxDays + 1);
    const filtered = scores.filter((entry) => new Date(entry.date) >= cutoff);
    if (filtered.length !== scores.length) {
      setScores(filtered);
      localStorage.setItem("scores", JSON.stringify(filtered));
    }
    if (!localStorage.getItem("lastRecordedDate")) {
      localStorage.setItem("lastRecordedDate", getTodayJST());
    }
  }, []);

  useEffect(() => localStorage.setItem("goal", goal), [goal]);
  useEffect(() => localStorage.setItem("total", total), [total]);
  useEffect(() => localStorage.setItem("todayScore", todayScore), [todayScore]);
  useEffect(() => localStorage.setItem("darkMode", JSON.stringify(darkMode)), [darkMode]);

  const addScore = (score) => {
    const now = new Date();
    const time = now.toLocaleTimeString("ja-JP", { hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit" });
    const newScores = [...scores, { date: selectedDate, time, score }];
    setScores(newScores);
    setTotal(total + score);
    if (selectedDate === getTodayJST()) setTodayScore(todayScore + score);
    localStorage.setItem("lastRecordedDate", getTodayJST());
  };

  const deleteEntry = (indexToDelete) => {
    const entryToDelete = scores[indexToDelete];
    const newScores = scores.filter((_, i) => i !== indexToDelete);
    setScores(newScores);
    setTotal(total - entryToDelete.score);
    if (entryToDelete.date === getTodayJST()) setTodayScore(todayScore - entryToDelete.score);
  };

  const entriesForSelectedDate = scores.map((entry, index) => ({ ...entry, index })).filter((e) => e.date === selectedDate);

  // ⭐ テーマ適用
  const theme = themes[selectedTheme];
  const backgroundColor = theme.background;
  const textColor = theme.text;
  const boxColor = theme.box;
  const fontFamily = theme.font;

  return (
    <div style={{ backgroundColor, color: textColor, fontFamily, minHeight: "100vh", padding: "5vw", maxWidth: "90vw", margin: "auto", paddingBottom: "100px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h1 style={{ margin: 0, fontSize: "min(5vw, 28px)", whiteSpace: "nowrap" }}>空腹スコア・ダイエット</h1>
        <button onClick={() => setDarkMode(!darkMode)} style={{ fontSize: "min(6vw, 32px)", background: "none", border: "none", cursor: "pointer" }} aria-label="ダークモード切り替え">
          {darkMode ? "🌞" : "🌙"}
        </button>
      </div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "10px" }}>
        <label style={{ fontSize: "4vw", marginRight: "10px" }}>📅 日付選択:</label>
        <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} style={{ fontSize: "4vw", padding: "5px" }} />
      </div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "20px" }}>
        <label style={{ fontSize: "4vw", marginRight: "10px" }}>🎨 テーマ:</label>
        <select value={selectedTheme} onChange={(e) => setSelectedTheme(e.target.value)} style={{ fontSize: "4vw", padding: "5px" }}>
          {Object.keys(themes).map((key) => (<option key={key} value={key}>{key}</option>))}
        </select>
      </div>

      <div style={{ marginBottom: "20px", background: boxColor, padding: "15px", borderRadius: "8px" }}>
        <h2 style={{ fontSize: "5vw" }}>{selectedDate === getTodayJST() ? "今日" : selectedDate} の記録</h2>
        {entriesForSelectedDate.length === 0 ? (
          <p style={{ fontSize: "4vw" }}>まだ記録がありません。</p>
        ) : (
          entriesForSelectedDate.map((entry) => (
            <p key={entry.index} style={{ fontSize: "4vw" }}>
              [{entry.time}] {"★".repeat(entry.score)}（{entry.score}点）
              <button onClick={() => deleteEntry(entry.index)} style={{ marginLeft: "10px", fontSize: "3.5vw", background: "none", border: "none", cursor: "pointer" }} aria-label="削除">🗑️</button>
            </p>
          ))
        )}
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", alignItems: "center", justifyContent: "center" }}>
        <label style={{ fontSize: "4vw" }}>目標：</label>
        <input type="number" value={goal} onChange
