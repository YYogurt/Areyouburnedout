"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";

export default function WriteForm() {
  const router = useRouter();
  const [nickname, setNickname] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  const maxChars = 280;
  const charCount = content.length;

  const getCharCountClass = (): string => {
    if (charCount > maxChars) return "danger";
    if (charCount > maxChars * 0.85) return "warning";
    return "";
  };

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (isSubmitting) return;

      const trimmedContent = content.trim();
      if (!trimmedContent) {
        setError("Please type what you want to vent");
        return;
      }

      if (trimmedContent.length > maxChars) {
        setError(`Message must be ${maxChars} characters or less`);
        return;
      }

      setIsSubmitting(true);
      setError("");

      try {
        const res = await fetch("/api/messages", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            nickname: nickname.trim(),
            content: trimmedContent,
          }),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Something went wrong");
        }

        // Show success animation
        setShowSuccess(true);

        // Redirect after animation
        setTimeout(() => {
          router.push("/");
        }, 2000);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
        setIsSubmitting(false);
      }
    },
    [content, nickname, isSubmitting, router]
  );

  if (showSuccess) {
    return (
      <div className="success-overlay">
        <div className="success-star">⭐</div>
        <p className="success-text">A new star is shining...</p>
        <p className="success-subtext">Thank you for sharing your feelings 💜</p>
      </div>
    );
  }

  return (
    <div className="write-card">
      {/* Decorative glows */}
      <div className="write-card-glow" />
      <div className="write-card-glow-2" />

      {/* Header */}
      <div className="write-header">
        <span className="write-icon">🌟</span>
        <h1 className="write-title">Let it go with the stars</h1>
        <p className="write-subtitle">
          Type what you want to vent. Your words will become a star
          <br />
          shining in the sky for everyone to see.
        </p>
      </div>

      {/* Form */}
      <form className="write-form" onSubmit={handleSubmit}>
        {/* Nickname field */}
        <div className="form-group">
          <label className="form-label" htmlFor="nickname-input">
            💫 Nickname{" "}
            <span className="form-label-optional">(optional)</span>
          </label>
          <input
            id="nickname-input"
            className="form-input"
            type="text"
            placeholder="e.g. North Star, Tired Soul"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            maxLength={30}
            disabled={isSubmitting}
          />
        </div>

        {/* Content field */}
        <div className="form-group">
          <label className="form-label" htmlFor="content-input">
            ✍️ What&apos;s on your mind?
          </label>
          <textarea
            id="content-input"
            className="form-input form-textarea"
            placeholder="I'm so tired... I just need a break from everything 🥺"
            value={content}
            onChange={(e) => {
              setContent(e.target.value);
              if (error) setError("");
            }}
            maxLength={maxChars + 10}
            disabled={isSubmitting}
          />
          <span className={`form-char-count ${getCharCountClass()}`}>
            {charCount}/{maxChars}
          </span>
        </div>

        {/* Error */}
        {error && <div className="error-message">⚠️ {error}</div>}

        {/* Submit */}
        <button
          type="submit"
          className="submit-btn"
          disabled={isSubmitting || charCount === 0 || charCount > maxChars}
          id="submit-message-btn"
        >
          {isSubmitting ? (
            <>
              <span className="loading-spinner" />
              Sending...
            </>
          ) : (
            <>
              ✨ Release a star into the sky
            </>
          )}
        </button>
      </form>
    </div>
  );
}
