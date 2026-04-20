"use client";

import { useEffect, useState } from "react";

interface Particle {
  id: number;
  left: string;
  top: string;
  size: number;
  color: string;
  floatDuration: number;
  floatDelay: number;
}

export default function ParticleBackground() {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [shootingStar, setShootingStar] = useState<{ id: number; x: number; y: number } | null>(null);

  useEffect(() => {
    const colors = [
      "rgba(167, 139, 250, 0.4)",
      "rgba(96, 165, 250, 0.3)",
      "rgba(244, 114, 182, 0.3)",
      "rgba(251, 191, 36, 0.3)",
      "rgba(129, 140, 248, 0.3)",
      "rgba(52, 211, 153, 0.2)",
    ];

    const newParticles: Particle[] = Array.from({ length: 40 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      size: 1 + Math.random() * 3,
      color: colors[Math.floor(Math.random() * colors.length)],
      floatDuration: 4 + Math.random() * 8,
      floatDelay: Math.random() * 5,
    }));

    setParticles(newParticles);
  }, []);

  // Random shooting stars
  useEffect(() => {
    const spawnShootingStar = () => {
      const id = Date.now();
      const x = Math.random() * 60;
      const y = Math.random() * 40;
      setShootingStar({ id, x, y });

      setTimeout(() => setShootingStar(null), 1500);
    };

    // First one after a short delay
    const initialTimeout = setTimeout(spawnShootingStar, 3000);

    // Then periodically
    const interval = setInterval(() => {
      if (Math.random() > 0.5) {
        spawnShootingStar();
      }
    }, 8000);

    return () => {
      clearTimeout(initialTimeout);
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="particle-bg">
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
            ["--float-duration" as string]: `${p.floatDuration}s`,
            ["--float-delay" as string]: `${p.floatDelay}s`,
          }}
        />
      ))}
      {shootingStar && (
        <div
          key={shootingStar.id}
          className="shooting-star"
          style={{
            left: `${shootingStar.x}%`,
            top: `${shootingStar.y}%`,
          }}
        />
      )}
    </div>
  );
}
