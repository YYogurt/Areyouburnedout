"use client";

import { useState, useCallback } from "react";
import { IMessage } from "@/types";
import StarItem from "./StarItem";
import MessageModal from "./MessageModal";

interface StarFieldProps {
  messages: IMessage[];
}

export default function StarField({ messages }: StarFieldProps) {
  const [selectedMessage, setSelectedMessage] = useState<IMessage | null>(null);

  const handleStarClick = useCallback((message: IMessage) => {
    setSelectedMessage(message);
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedMessage(null);
  }, []);

  return (
    <div className="starfield-container" id="star-field">
      {/* Header text */}
      <div className="starfield-header">
        <h1 className="starfield-title">
          The Sky of <span>Star Vent</span>
        </h1>
        <p className="starfield-subtitle">
          Tap on each star to read the story within
        </p>
      </div>

      {/* Stars */}
      {messages.length === 0 ? (
        <div className="starfield-empty">
          <div className="starfield-empty-icon">🌑</div>
          <p className="starfield-empty-text">The sky is still empty...</p>
          <p className="starfield-empty-hint">
            Be the first to send a star into the sky!
          </p>
        </div>
      ) : (
        messages.map((msg) => (
          <StarItem
            key={msg._id}
            message={msg}
            onClick={handleStarClick}
          />
        ))
      )}

      {/* Message Modal */}
      {selectedMessage && (
        <MessageModal
          message={selectedMessage}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}
