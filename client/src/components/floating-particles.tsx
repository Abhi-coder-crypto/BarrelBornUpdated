import { motion } from "framer-motion";

const particles = [
  { id: 1, top: "20%", left: "10%", delay: 0, size: 8 },
  { id: 2, top: "60%", left: "80%", delay: 1, size: 12 },
  { id: 3, top: "40%", left: "60%", delay: 2, size: 6 },
  { id: 4, top: "80%", left: "30%", delay: 3, size: 10 },
  { id: 5, top: "15%", left: "70%", delay: 4, size: 14 },
  { id: 6, top: "70%", left: "15%", delay: 5, size: 8 },
  { id: 7, top: "30%", left: "90%", delay: 1.5, size: 7 },
  { id: 8, top: "50%", left: "5%", delay: 2.5, size: 11 },
  { id: 9, top: "25%", left: "45%", delay: 3.5, size: 9 },
  { id: 10, top: "75%", left: "55%", delay: 4.5, size: 6 },
  { id: 11, top: "35%", left: "25%", delay: 5.5, size: 13 },
  { id: 12, top: "65%", left: "75%", delay: 0.5, size: 8 },
  { id: 13, top: "10%", left: "40%", delay: 1.2, size: 10 },
  { id: 14, top: "85%", left: "65%", delay: 2.8, size: 7 },
  { id: 15, top: "45%", left: "85%", delay: 3.8, size: 12 },
  { id: 16, top: "55%", left: "20%", delay: 4.8, size: 9 },
  { id: 17, top: "22%", left: "75%", delay: 0.8, size: 11 },
  { id: 18, top: "72%", left: "35%", delay: 1.8, size: 8 },
  { id: 19, top: "38%", left: "10%", delay: 2.3, size: 6 },
  { id: 20, top: "88%", left: "50%", delay: 3.3, size: 14 },
];

export default function FloatingParticles() {
  return (
    <div className="fixed inset-0 pointer-events-none z-10">
      {/* Solid white floating particles */}
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full bg-white opacity-60"
          style={{
            top: particle.top,
            left: particle.left,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
          }}
          animate={{
            y: [0, -20, 0],
            x: [0, 10, 0],
            opacity: [0.3, 0.6, 0.3],
            scale: [0.8, 1.2, 0.8],
          }}
          transition={{
            duration: 6 + Math.random() * 2,
            repeat: Infinity,
            delay: particle.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}