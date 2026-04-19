"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import html2canvas from "html2canvas";
import { questions } from "@/data/questions";
import { getResult } from "@/data/results";

export default function Home() {
  const [screen, setScreen] = useState("landing"); // landing | quiz | result
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [totalScore, setTotalScore] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isPageTransitioning, setIsPageTransitioning] = useState(false);

  // Music State
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const audioRef = useRef(null);

  const toggleMusic = useCallback(() => {
    if (!audioRef.current) return;
    if (isPlayingMusic) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch((e) => {
        console.error("Audio playback failed", e);
      });
    }
    setIsPlayingMusic(!isPlayingMusic);
  }, [isPlayingMusic]);

  // Helper สำหรับเปลี่ยนหน้าจอแบบมี Transition (ไม่กระชากเหมือน refresh)
  const changeScreen = useCallback((newScreen) => {
    setIsPageTransitioning(true);
    setTimeout(() => {
      setScreen(newScreen);
      setIsPageTransitioning(false);
    }, 250); // รอให้ fade-out เสร็จก่อนค่อยเปลี่ยน component
  }, []);

  // Calculate total score when answers change
  useEffect(() => {
    const score = Object.values(answers).reduce((sum, s) => sum + s, 0);
    setTotalScore(score);
  }, [answers]);

  const startQuiz = useCallback(() => {
    setAnswers({});
    setCurrentQuestion(0);
    setIsTransitioning(false);

    // เล่นเพลงเมื่อผู้ใช้กดเริ่ม (User Interaction ทำให้ Browser ไม่บล็อก)
    if (audioRef.current && !isPlayingMusic) {
      audioRef.current.play().then(() => {
        setIsPlayingMusic(true);
      }).catch((e) => console.log("Audio play failed", e));
    }

    changeScreen("quiz");
  }, [changeScreen, isPlayingMusic]);

  // Animate card out → change question → animate card in
  const transitionQuestion = useCallback((fn) => {
    setIsTransitioning(true);
    setTimeout(() => {
      fn();
      setIsTransitioning(false);
    }, 250);
  }, []);

  const selectOption = useCallback(
    (questionId, score) => {
      setAnswers((prev) => ({ ...prev, [questionId]: score }));

      setTimeout(() => {
        if (currentQuestion < questions.length - 1) {
          transitionQuestion(() => setCurrentQuestion((prev) => prev + 1));
        } else {
          setScreen("result");
        }
      }, 300);
    },
    [currentQuestion, transitionQuestion]
  );

  const goBack = useCallback(() => {
    if (currentQuestion > 0) {
      transitionQuestion(() => setCurrentQuestion((prev) => prev - 1));
    } else {
      changeScreen("landing");
    }
  }, [currentQuestion, transitionQuestion, changeScreen]);

  const resetQuiz = useCallback(() => {
    changeScreen("landing");
    setTimeout(() => {
      setCurrentQuestion(0);
      setAnswers({});
    }, 250); // รีเซ็ตค่าหลังจากหน้าจอ fade-out ไปแล้ว
  }, [changeScreen]);

  const result = getResult(totalScore);

  return (
    <main className="main-container">
      {/* Background Audio Element */}
      <audio ref={audioRef} src="/music/bgm.mp3" loop />
      
      {/* Background Music Player UI */}
      <MusicPlayer isPlaying={isPlayingMusic} toggleMusic={toggleMusic} />

      {/* Decorative particles */}
      <Particles />

      <div className={`screen-wrapper ${isPageTransitioning ? "screen-fade-out" : ""}`}>
        {screen === "landing" && (
          <LandingScreen onStart={startQuiz} />
        )}

        {screen === "quiz" && (
          <QuizScreen
            question={questions[currentQuestion]}
            questionIndex={currentQuestion}
            totalQuestions={questions.length}
            answers={answers}
            onSelect={selectOption}
            onBack={goBack}
            isTransitioning={isTransitioning}
          />
        )}

        {screen === "result" && result && (
          <ResultScreen
            result={result}
            totalScore={totalScore}
            maxScore={questions.length * 2}
            onReset={resetQuiz}
          />
        )}
      </div>

      <footer className="footer">
        <p>
          แบบประเมินนี้ไม่ใช่การวินิจฉัยทางการแพทย์ ·{" "}
          <a 
            href="https://1323alltime.camri.go.th/" 
            target="_blank" 
            rel="noopener noreferrer" 
            id="footer-helpline"
          >
            สายด่วนสุขภาพจิต 1323
          </a>
        </p>
      </footer>
    </main>
  );
}

/* ===== Landing Screen ===== */
function LandingScreen({ onStart }) {
  return (
    <section
      className="hero-section"
      id="landing-section"
    >
      <span className="hero-emoji" role="img" aria-label="fire">
        🔥
      </span>
      <h1 className="hero-title">Are You Burned Out?</h1>
      <p className="hero-subtitle">
        แบบประเมินง่าย ๆ 6 ข้อ
        <br />
        เพื่อดูว่าคุณกำลัง &quot;หมดไฟ&quot; หรือแค่ &quot;เหนื่อย&quot;
      </p>
      <button
        className="btn-primary"
        onClick={onStart}
        id="start-quiz-btn"
      >
        เริ่มทำแบบประเมิน
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      </button>
      <p className="hero-disclaimer">
        ⚠️ แบบประเมินนี้ไม่ใช่การวินิจฉัยทางการแพทย์
        <br />
        เป็นเพียงแนวทางให้สำรวจตัวเองเบื้องต้น
      </p>
    </section>
  );
}

/* ===== Quiz Screen ===== */
function QuizScreen({
  question,
  questionIndex,
  totalQuestions,
  answers,
  onSelect,
  onBack,
  isTransitioning,
}) {
  const progress = ((questionIndex + 1) / totalQuestions) * 100;
  const selectedScore = answers[question.id];

  return (
    <section className="quiz-section" id="quiz-section">
      {/* Progress — ไม่ animate ให้คงอยู่ตลอด */}
      <div className="progress-container">
        <div className="progress-header">
          <span className="progress-text">ความคืบหน้า</span>
          <span className="progress-count">
            {questionIndex + 1} / {totalQuestions}
          </span>
        </div>
        <div className="progress-bar-track">
          <div
            className="progress-bar-fill"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question card — animate เฉพาะ card */}
      <div className={`question-card ${isTransitioning ? "fade-out" : ""}`}>
        <span className="question-emoji" role="img">
          {question.emoji}
        </span>
        <h2 className="question-text">{question.question}</h2>

        <div className="options-list">
          {question.options.map((option) => (
            <button
              key={option.label}
              className={`option-button ${
                selectedScore === option.score ? "selected" : ""
              }`}
              onClick={() => onSelect(question.id, option.score)}
              id={`option-${question.id}-${option.label}`}
            >
              <span className="option-label">{option.label}</span>
              <span className="option-text">{option.text}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="quiz-nav">
        <button
          className="btn-secondary"
          onClick={onBack}
          id="quiz-back-btn"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          ย้อนกลับ
        </button>
        <span className="progress-count" style={{ fontSize: "0.8rem" }}>
          ข้อ {questionIndex + 1} จาก {totalQuestions}
        </span>
      </div>
    </section>
  );
}

/* ===== Result Screen ===== */
function ResultScreen({ result, totalScore, maxScore, onReset }) {
  const percentage = (totalScore / maxScore) * 100;
  const resultRef = useRef(null);

  const downloadBlob = (blob) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "my-burnout-result.png";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleShare = async () => {
    if (!resultRef.current) return;
    
    // เปลี่ยนปุ่มเป็นสถานะกำลังโหลดได้ถ้าต้องการ แต่ที่นี่ทำให้เร็วที่สุด
    try {
      const canvas = await html2canvas(resultRef.current, {
        backgroundColor: "#f8fafc", // Light theme background
        scale: 2, // High resolution
        windowWidth: 640,
        useCORS: true,
      });
      
      canvas.toBlob(async (blob) => {
        if (!blob) return;
        
        const file = new File([blob], "my-burnout-result.png", { type: "image/png" });
        const shareText = `ผลประเมินความ Burnout ของฉัน: ${result.emoji} ${result.title} (${totalScore}/${maxScore} คะแนน)\n\nลองทำแบบประเมินได้ที่:`;
        
        // ลองใช้ Web Share API พร้อมแนบรูป
        if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
          try {
            await navigator.share({
              title: "Are You Burned Out?",
              text: shareText,
              files: [file],
            });
          } catch (err) {
            // User cancelled or share failed, fallback to download
            if (err.name !== "AbortError") {
              downloadBlob(blob);
            }
          }
        } else {
          // Fallback สำหรับ PC หรือ Browser ที่ไม่รองรับ Share API
          downloadBlob(blob);
          alert("บันทึกรูปผลลัพธ์ลงเครื่องเรียบร้อยแล้ว! สามารถนำไปแชร์ต่อได้เลยครับ");
        }
      });
    } catch (error) {
      console.error("Error generating image:", error);
      alert("เกิดข้อผิดพลาดในการสร้างรูปภาพ");
    }
  };

  return (
    <section
      className="result-section"
      id="result-section"
    >
      <div className="result-card" ref={resultRef}>
        {/* Glow effect */}
        <div
          className="result-glow"
          style={{ background: result.color }}
        />
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "4px",
            background: result.gradient,
            borderRadius: "32px 32px 0 0",
          }}
        />

        <span className="result-emoji" role="img">
          {result.emoji}
        </span>

        <div className="result-score" style={{ color: result.color }}>
          {totalScore}
        </div>
        <div className="result-score-label">
          คะแนน (จาก {maxScore} คะแนน)
        </div>

        {/* Score Meter */}
        <div className="score-meter">
          <div className="score-meter-track">
            <div
              className="score-meter-fill"
              style={{
                width: `${percentage}%`,
                background: result.gradient,
              }}
            />
          </div>
          <div className="score-meter-labels">
            <span>0</span>
            <span>ปกติ</span>
            <span>เริ่มหมดไฟ</span>
            <span>หมดไฟสูง</span>
            <span>{maxScore}</span>
          </div>
        </div>

        <h2 className="result-title" style={{ color: result.color }}>
          {result.title}
        </h2>
        <p className="result-subtitle">{result.subtitle}</p>

        <div className="result-divider" />

        {/* Description */}
        <div className="result-description">
          <p>{result.longDesc}</p>
        </div>

        {/* Tips */}
        <div className="result-tips">
          <h3 className="result-tips-title">💡 สิ่งที่คุณทำได้ตอนนี้</h3>
          <ul className="result-tips-list">
            {result.tips.map((tip, i) => (
              <li key={i}>
                <span
                  className="tip-icon"
                  style={{ background: result.color }}
                />
                {tip}
              </li>
            ))}
          </ul>
        </div>

        {/* Helpline (for high burnout) */}
        {result.helpline && (
          <div className="helpline-card">
            <p className="helpline-title">{result.helpline.text}</p>
            <a
              href="https://1323alltime.camri.go.th/"
              target="_blank"
              rel="noopener noreferrer"
              className="helpline-number"
              id="helpline-number-link"
            >
              สายด่วนสุขภาพจิต 1323
            </a>
            <p className="helpline-available">{result.helpline.available}</p>
          </div>
        )}

        {/* Actions */}
        <div className="result-actions" data-html2canvas-ignore="true">
          <button
            className="share-btn"
            onClick={handleShare}
            id="share-result-btn"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="18" cy="5" r="3" />
              <circle cx="6" cy="12" r="3" />
              <circle cx="18" cy="19" r="3" />
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
              <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
            </svg>
            แชร์ผลลัพธ์
          </button>
          <button
            className="btn-secondary"
            onClick={onReset}
            id="retake-quiz-btn"
            style={{ justifyContent: "center" }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
              <path d="M3 3v5h5" />
              <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
              <path d="M21 21v-5h-5" />
            </svg>
            ทำแบบประเมินอีกครั้ง
          </button>
        </div>
      </div>
    </section>
  );
}

/* ===== Decorative Particles ===== */
function Particles() {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const colors = ["#a78bfa", "#60a5fa", "#f472b6", "#818cf8"];
    const newParticles = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      size: 2 + Math.random() * 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      duration: 3 + Math.random() * 4,
      delay: Math.random() * 3,
    }));
    setParticles(newParticles);
  }, []);

  return (
    <>
      {particles.map((p) => (
        <div
          key={p.id}
          className="particle"
          style={{
            left: p.left,
            top: p.top,
            width: `${p.size}px`,
            height: `${p.size}px`,
            background: p.color,
            animation: `float ${p.duration}s ease-in-out ${p.delay}s infinite`,
          }}
        />
      ))}
    </>
  );
}

/* ===== Music Player ===== */
function MusicPlayer({ isPlaying, toggleMusic }) {
  return (
    <div className="music-player">
      <button className="music-btn" onClick={toggleMusic} aria-label="Toggle music" id="music-toggle-btn">
        {isPlaying ? "🔊" : "🔇"}
      </button>
    </div>
  );
}
