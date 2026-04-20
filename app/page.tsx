"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { IMessage } from "@/types";
import Navbar from "@/components/Navbar";
import ParticleBackground from "@/components/ParticleBackground";
import StarField from "@/components/StarField";

export default function DashboardPage() {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchMessages = useCallback(async () => {
    try {
      const res = await fetch("/api/messages", { cache: "no-store" });
      const data = await res.json();

      if (data.success) {
        setMessages(data.data);
        setError("");
      } else {
        setError(data.error || "Unable to load data");
      }
    } catch {
      setError("Unable to connect to server");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  // Auto-refresh every 15 seconds
  useEffect(() => {
    const interval = setInterval(fetchMessages, 15000);
    return () => clearInterval(interval);
  }, [fetchMessages]);

  return (
    <>
      <ParticleBackground />
      <Navbar />

      <main className="main-content">
        {isLoading ? (
          <div className="starfield-container" style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}>
            <div style={{ textAlign: "center" }}>
              <div className="loading-spinner" style={{ width: 40, height: 40, borderWidth: 3 }} />
              <p style={{ color: "var(--text-muted)", marginTop: 16, fontSize: "0.9rem" }}>
                Loading stars...
              </p>
            </div>
          </div>
        ) : error ? (
          <div className="starfield-container" style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "3rem", marginBottom: 16, opacity: 0.5 }}>⚠️</div>
              <p style={{ color: "var(--text-secondary)", marginBottom: 8 }}>{error}</p>
              <p style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>
                Make sure MONGODB_URI is set in .env.local
              </p>
            </div>
          </div>
        ) : (
          <StarField messages={messages} />
        )}

        {/* Floating CTA for mobile */}
        <Link href="/write" className="floating-cta" id="floating-write-btn">
          ✍️
        </Link>
      </main>

      <footer className="footer">
        <p>
          Star Vent — A safe space to express your feelings ·{" "}
          <a
            href="https://1323alltime.camri.go.th/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Mental Health Hotline 1323
          </a>
        </p>
      </footer>
    </>
  );
}
