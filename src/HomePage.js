import React, { useState, useEffect } from "react";

export default function HomePage() {
  const getTodayJST = () => new Date().toISOString().split("T")[0];

  const [scores, setScores] = useState(() => {
    const saved = localStorage.getItem("scores");
    return saved ? JSON.parse(saved) : [];
  });

  const [goal, setGoal] = useState(() => {
    return Number(localStorage.getItem("goal")) || 300;
  });

  const [total, setTotal] = useState(() => {
    return Number(localStorage.getItem("total")) || 0;
  });

  const [todayScore, setTodayScore] = useState(() => {
    return Number(localStorage.getItem("todayScore")) || 0;
  });

  const [darkMode, setDarkMode] = useState(() => {
    return JSON.parse(localStorage.getItem("darkMode")) || false;
  });

  const [selectedDate, setSelectedDate] = useState(() => getTodayJST());

  useEffect(() => {
    localStorage.setItem("selectedDate", selectedDate);
  }, [selectedDate]);

  useEffect(() => {
    const checkDateChange = () => {
      const todayDate = getTodayJST();
      if (localStorage.getItem("lastRecordedDate") !== todayDate) {
        setTodayScore(0);
        localStorage.setItem("lastRecordedDate", todayDate);
      }
    };
    checkDateChange();
    const interval = setInterval(checkDateChange, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handler = () => {
      setScores(JSON.parse(localStorage.getItem("scores") || "[]"));
      setSelectedDate(getTodayJST()); // ⭐️ アプリ再開時に日付を今日に戻す
    };
    window.addEventListener("focus", handler);
    return () => window.removeEventListener("focus", handler);
  }, []);

  useEffect(() => localStorage.setItem("goal", goal), [goal]);
  useEffect(() => localStorage.setItem("total", total), [total]);
  useEffect(() => localStorage.setItem("todayScore", todayScore), [todayScore]);
  useEffect(() => localStorage.setItem("darkMode", JSON.stringify(darkMode)), [darkMode]);

  const encouragements = [
  "おめでとう！一歩近づいたね！",
  "いいね！継続は力なり！",
  "やったね！前進してるよ！",
  "ナイス！今日も進んでる！",
  "素敵！未来が近づいてる！",
  "小さな積み重ねが大きな変化を生む！",
  "グッジョブ！習慣化に一歩前進！",
  "自分に拍手！",
  "しっかり自分を生きてるね！",
  "その調子！きっと未来が変わるよ！",
  "こうやって少しずつ夢に近づいてる！",
  "今日もちゃんと自分と向き合えたね！",
  "すばらしい！きっと後から効いてくるよ！",
  "心の筋トレ成功！",
  "未来の自分が感謝してるよ！",
  "まさに意志の勝利！",
  "もうすぐ目標が見えてくるよ！",
  "今、脂肪がエネルギーに変わっているよ！",
  "オートファジーが働いて、体がリフレッシュ中！",
  "細胞が若返ってる最中かも！すごいね！",
  "血糖値が落ち着いて、代謝が整ってるよ！",
  "脂肪燃焼モードに切り替わった証拠！",
  "内臓が休まって、全身が整い始めてる！",
  "今こそ、体のメンテナンスタイム！",
  "空腹こそ最高のデトックス！体が喜んでるよ！",
  "免疫力アップ中！自然治癒力が高まってる！",
  "素晴らしい！思考もクリアになるよ！",
  "今、あなたの体は生まれ変わりの真っ最中！"
];


const addScore = (score) => {
  const now = new Date();
  const time = now.toLocaleTimeString("ja-JP", { hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit" });
  const newScores = [...scores, { date: selectedDate, time, score }];
  setScores(newScores);
  setTotal(total + score);
  if (selectedDate === getTodayJST()) setTodayScore(todayScore + score);
  localStorage.setItem("scores", JSON.stringify(newScores));
  localStorage.setItem("lastRecordedDate", getTodayJST());

  // ⭐️ ランダムな励ましを表示
  const msg = encouragements[Math.floor(Math.random() * encouragements.length)];
  alert(msg);
};


  const deleteEntry = (index) => {
    const entry = scores[index];
    const newScores = scores.filter((_, i) => i !== index);
    setScores(newScores);
    setTotal(total - entry.score);
    if (entry.date === getTodayJST()) setTodayScore(todayScore - entry.score);
    localStorage.setItem("scores", JSON.stringify(newScores));
  };

  const entries = scores
    .map((e, i) => ({ ...e, index: i }))
    .filter((e) => e.date === selectedDate);

  const bg = darkMode ? "#121212" : "#fff";
  const text = darkMode ? "#f0f0f0" : "#000";
  const box = darkMode ? "#1e1e1e" : "#f9f9f9";

  return (
    <div style={{ backgroundColor: bg, color: text, minHeight: "100vh", padding: "5vw", maxWidth: "90vw", margin: "auto", paddingBottom: "100px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h1 style={{ margin: 0, fontSize: "min(5vw,28px)" }}>空腹スコア・ダイエット</h1>
        <button onClick={() => setDarkMode(!darkMode)} style={{ fontSize: "min(6vw,32px)", background: "none", border: "none", cursor: "pointer" }}>{darkMode ? "🌞" : "🌙"}</button>
      </div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "10px" }}>
        <label style={{ fontSize: "4vw", marginRight: "10px" }}>📅 日付:</label>
        <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} style={{ fontSize: "4vw", padding: "5px" }} />
      </div>

      <div style={{ marginBottom: "20px", background: box, padding: "15px", borderRadius: "8px" }}>
        <h2 style={{ fontSize: "5vw" }}>{selectedDate === getTodayJST() ? "今日" : selectedDate} の記録</h2>
        {entries.length === 0 ? (
          <p style={{ fontSize: "4vw" }}>まだ記録がありません。</p>
        ) : (
          entries.map((e) => (
            <p key={e.index} style={{ fontSize: "4vw" }}>
              [{e.time}] {"★".repeat(e.score)}（{e.score}点）
              <button onClick={() => deleteEntry(e.index)} style={{ marginLeft: "10px", fontSize: "3.5vw", background: "none", border: "none", cursor: "pointer" }}>🗑️</button>
            </p>
          ))
        )}
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", alignItems: "center", justifyContent: "center" }}>
        <label style={{ fontSize: "4vw" }}>目標：</label>
        <input type="number" value={goal} onChange={(e) => setGoal(Number(e.target.value))} style={{ padding: "10px", fontSize: "4vw", width: "40vw" }} />
      </div>

      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: bg, borderTop: darkMode ? "1px solid #444" : "1px solid #ccc", padding: "20px 10px", display: "flex", justifyContent: "center", gap: "20px", zIndex: 1000 }}>
        <button onClick={() => addScore(1)} style={{ fontSize: "5vw", padding: "10px 15px" }}>★☆☆</button>
        <button onClick={() => addScore(2)} style={{ fontSize: "5vw", padding: "10px 15px" }}>★★☆</button>
        <button onClick={() => addScore(3)} style={{ fontSize: "5vw", padding: "10px 15px" }}>★★★</button>
      </div>
    </div>
  );
}
