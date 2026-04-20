"use client";

import { IMessage } from "@/types";

interface StarItemProps {
  message: IMessage;
  onClick: (message: IMessage) => void;
}

export default function StarItem({ message, onClick }: StarItemProps) {
  const size = message.starSize || 30;
  const color = message.color || "#fbbf24";

  // Randomize twinkle timing per star
  const twinkleDelay = `${(Math.random() * 4).toFixed(1)}s`;
  const twinkleDuration = `${(2 + Math.random() * 3).toFixed(1)}s`;

  const previewText =
    message.content.length > 40
      ? message.content.slice(0, 40) + "..."
      : message.content;

  return (
    <div
      className="star-item"
      style={{
        left: `${message.posX}%`,
        top: `${message.posY}%`,
        ["--twinkle-delay" as string]: twinkleDelay,
        ["--twinkle-duration" as string]: twinkleDuration,
      }}
      onClick={() => onClick(message)}
      role="button"
      tabIndex={0}
      aria-label={`Message from ${message.nickname || "someone"}`}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onClick(message);
      }}
    >
      {/* Star SVG */}
      <svg
        className="star-svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill={color}
        style={{ color }}
      >
        <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 16.8l-6.2 4.5 2.4-7.4L2 9.4h7.6z" />
      </svg>

      {/* Hover tooltip */}
      <div className="star-tooltip">
        {message.nickname && (
          <div className="star-tooltip-nickname">{message.nickname}</div>
        )}
        <div>{previewText}</div>
      </div>
    </div>
  );
}
