"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.5, ease: "easeOut" },
  }),
};

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center text-center py-20 px-4 min-h-screen">
      <motion.h1
        className="text-3xl font-bold mb-2"
        initial="hidden"
        animate="visible"
        custom={0}
        variants={fadeUp}
      >
        <span className="text-green-400">Koin</span> — a track spending, no math degree needed
      </motion.h1>

      <motion.p
        className="text-gray-500 mb-6"
        initial="hidden"
        animate="visible"
        custom={1}
        variants={fadeUp}
      >
        Log expenses, see where your money goes, get simple tips.
      </motion.p>

      <motion.div initial="hidden" animate="visible" custom={2} variants={fadeUp}>
        <Link href="/login">
          <button className="bg-emerald-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-emerald-700 transition-colors">
            Get Started
          </button>
        </Link>
      </motion.div>
    </div>
  );
}