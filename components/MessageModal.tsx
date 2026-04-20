"use client";

import { IMessage } from "@/types";

interface MessageModalProps {
  message: IMessage;
  onClose: () => void;
}

const HEALING_QUOTES = [
  "Every feeling you have matters.",
  "You are not alone in this.",
  "Sometimes, just letting it out is enough.",
  "Tomorrow will always be better.",
  "You've been so strong to make it this far.",
  "It's okay not to be okay.",
  "Stars still shine, even on the darkest nights.",
  "It's okay to rest. You don't have to rush.",
];

function getRandomQuote(): string {
  return HEALING_QUOTES[Math.floor(Math.random() * HEALING_QUOTES.length)];
}

function formatDate(dateStr: Date | string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffHr = Math.floor(diffMs / 3600000);
  const diffDay = Math.floor(diffMs / 86400000);

  if (diffMin < 1) return "Just now";
  if (diffMin < 60) return `${diffMin} min ago`;
  if (diffHr < 24) return `${diffHr} hr ago`;
  if (diffDay < 7) return `${diffDay} day${diffDay > 1 ? "s" : ""} ago`;

  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function MessageModal({ message, onClose }: MessageModalProps) {
  const quote = getRandomQuote();

  return (
    <div className="modal-overlay" onClick={onClose} id="message-modal-overlay">
      <div
        className="modal-card"
        onClick={(e) => e.stopPropagation()}
        style={{ ["--modal-color" as string]: message.color }}
        id="message-modal-card"
      >
        {/* Glow background */}
        <div className="modal-glow" />

        {/* Close button */}
        <button
          className="modal-close"
          onClick={onClose}
          aria-label="Close"
          id="modal-close-btn"
        >
          ✕
        </button>

        {/* Star icon */}
        <div
          className="modal-star-icon"
          style={{ ["--modal-color" as string]: message.color }}
        >
          ⭐
        </div>

        {/* Message content */}
        <p className="modal-content">{message.content}</p>

        {/* Nickname */}
        <p className="modal-nickname">
          — {message.nickname || "Someone"} —
        </p>

        {/* Time */}
        <p className="modal-time">{formatDate(message.createdAt)}</p>

        {/* Divider */}
        <div className="modal-divider" />

        {/* Healing quote */}
        <p className="modal-healing-text">💫 {quote}</p>
      </div>
    </div>
  );
}
