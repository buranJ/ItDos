"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import {
  Globe,
  Layout,
  TrendingUp,
  Database,
  Sparkles,
  MessageSquare,
  Settings2,
  ShoppingBag,
  Bot,
  Zap,
  Code2,
  BarChart3,
  ArrowRight,
} from "lucide-react";
import { gsap } from "@/lib/gsap";
import { MagneticButton } from "@/components/motion/MagneticButton";
import { Container } from "@/components/layout/Container";
import { lerp } from "@/lib/utils";
import { ChatMock } from "@/components/portfolio/mockups/ChatMock";

/* ─── Chaotic small squares (snow effect) ───────────────────────────────── */
type Square = {
  id: number;
  size: number;
  x: string;
  y: string;
  rotate: number;
  opacity: number;
  filled: boolean;
  duration: number;
  delay: number;
  w1x: number;
  w1y: number;
  w2x: number;
  w2y: number;
  w3x: number;
  w3y: number;
  w4x: number;
  w4y: number;
  r1: number;
  r2: number;
  r3: number;
  r4: number;
};

const squares: Square[] = [
  // ── основные ──────────────────────────────────────────────────────────────
  {
    id: 1,
    size: 8,
    x: "7%",
    y: "14%",
    rotate: 0,
    opacity: 0.1,
    filled: false,
    duration: 14,
    delay: 0,
    w1x: 16,
    w1y: -20,
    w2x: -10,
    w2y: -38,
    w3x: 22,
    w3y: -18,
    w4x: 6,
    w4y: -30,
    r1: 22,
    r2: -14,
    r3: 30,
    r4: 8,
  },
  {
    id: 2,
    size: 5,
    x: "11%",
    y: "31%",
    rotate: 15,
    opacity: 0.14,
    filled: true,
    duration: 10,
    delay: 1.5,
    w1x: -14,
    w1y: -10,
    w2x: 8,
    w2y: -24,
    w3x: -20,
    w3y: -8,
    w4x: 4,
    w4y: -18,
    r1: -20,
    r2: 12,
    r3: -30,
    r4: 5,
  },
  {
    id: 3,
    size: 12,
    x: "4%",
    y: "55%",
    rotate: 30,
    opacity: 0.07,
    filled: false,
    duration: 18,
    delay: 0.7,
    w1x: 20,
    w1y: -14,
    w2x: -6,
    w2y: -28,
    w3x: 18,
    w3y: -6,
    w4x: -8,
    w4y: -20,
    r1: 18,
    r2: -24,
    r3: 10,
    r4: -16,
  },
  {
    id: 4,
    size: 6,
    x: "16%",
    y: "70%",
    rotate: 0,
    opacity: 0.11,
    filled: true,
    duration: 12,
    delay: 2.3,
    w1x: -18,
    w1y: -22,
    w2x: 12,
    w2y: -12,
    w3x: -24,
    w3y: -30,
    w4x: 8,
    w4y: -16,
    r1: -28,
    r2: 16,
    r3: -40,
    r4: 0,
  },
  {
    id: 5,
    size: 9,
    x: "23%",
    y: "88%",
    rotate: 45,
    opacity: 0.09,
    filled: false,
    duration: 16,
    delay: 1,
    w1x: 14,
    w1y: -18,
    w2x: -22,
    w2y: -8,
    w3x: 10,
    w3y: -28,
    w4x: -16,
    w4y: -14,
    r1: 14,
    r2: -18,
    r3: 20,
    r4: -8,
  },
  {
    id: 6,
    size: 7,
    x: "28%",
    y: "18%",
    rotate: 20,
    opacity: 0.1,
    filled: false,
    duration: 11,
    delay: 3,
    w1x: -10,
    w1y: -24,
    w2x: 18,
    w2y: -14,
    w3x: -6,
    w3y: -32,
    w4x: 20,
    w4y: -10,
    r1: -16,
    r2: 22,
    r3: -10,
    r4: 18,
  },
  {
    id: 7,
    size: 5,
    x: "36%",
    y: "7%",
    rotate: 0,
    opacity: 0.15,
    filled: true,
    duration: 9,
    delay: 0.3,
    w1x: 22,
    w1y: -12,
    w2x: -8,
    w2y: -26,
    w3x: 16,
    w3y: -8,
    w4x: -12,
    w4y: -20,
    r1: 26,
    r2: -12,
    r3: 34,
    r4: -6,
  },
  {
    id: 8,
    size: 10,
    x: "55%",
    y: "5%",
    rotate: 10,
    opacity: 0.07,
    filled: false,
    duration: 20,
    delay: 1.8,
    w1x: -16,
    w1y: -18,
    w2x: 10,
    w2y: -30,
    w3x: -20,
    w3y: -10,
    w4x: 14,
    w4y: -24,
    r1: -22,
    r2: 14,
    r3: -30,
    r4: 8,
  },
  {
    id: 9,
    size: 6,
    x: "63%",
    y: "74%",
    rotate: 35,
    opacity: 0.12,
    filled: true,
    duration: 13,
    delay: 2,
    w1x: 18,
    w1y: -20,
    w2x: -12,
    w2y: -10,
    w3x: 24,
    w3y: -28,
    w4x: -8,
    w4y: -16,
    r1: 20,
    r2: -24,
    r3: 12,
    r4: -20,
  },
  {
    id: 10,
    size: 8,
    x: "70%",
    y: "91%",
    rotate: 0,
    opacity: 0.1,
    filled: false,
    duration: 15,
    delay: 0.5,
    w1x: -20,
    w1y: -14,
    w2x: 16,
    w2y: -22,
    w3x: -10,
    w3y: -32,
    w4x: 20,
    w4y: -12,
    r1: -18,
    r2: 20,
    r3: -26,
    r4: 14,
  },
  {
    id: 11,
    size: 5,
    x: "76%",
    y: "47%",
    rotate: 50,
    opacity: 0.13,
    filled: true,
    duration: 10,
    delay: 3.5,
    w1x: 12,
    w1y: -26,
    w2x: -18,
    w2y: -8,
    w3x: 20,
    w3y: -18,
    w4x: -10,
    w4y: -28,
    r1: 16,
    r2: -20,
    r3: 24,
    r4: -10,
  },
  {
    id: 12,
    size: 11,
    x: "84%",
    y: "22%",
    rotate: 20,
    opacity: 0.07,
    filled: false,
    duration: 17,
    delay: 1.2,
    w1x: -14,
    w1y: -20,
    w2x: 22,
    w2y: -10,
    w3x: -18,
    w3y: -28,
    w4x: 10,
    w4y: -18,
    r1: -24,
    r2: 18,
    r3: -32,
    r4: 12,
  },
  {
    id: 13,
    size: 6,
    x: "89%",
    y: "68%",
    rotate: 0,
    opacity: 0.11,
    filled: false,
    duration: 12,
    delay: 2.8,
    w1x: 20,
    w1y: -16,
    w2x: -10,
    w2y: -28,
    w3x: 16,
    w3y: -12,
    w4x: -20,
    w4y: -22,
    r1: 18,
    r2: -22,
    r3: 26,
    r4: -14,
  },
  {
    id: 14,
    size: 4,
    x: "93%",
    y: "40%",
    rotate: 30,
    opacity: 0.17,
    filled: true,
    duration: 8,
    delay: 0.8,
    w1x: -12,
    w1y: -22,
    w2x: 18,
    w2y: -12,
    w3x: -22,
    w3y: -30,
    w4x: 8,
    w4y: -16,
    r1: -20,
    r2: 24,
    r3: -28,
    r4: 10,
  },
  {
    id: 15,
    size: 7,
    x: "50%",
    y: "95%",
    rotate: 15,
    opacity: 0.1,
    filled: false,
    duration: 14,
    delay: 1.5,
    w1x: 16,
    w1y: -18,
    w2x: -20,
    w2y: -8,
    w3x: 12,
    w3y: -26,
    w4x: -16,
    w4y: -14,
    r1: 22,
    r2: -16,
    r3: 30,
    r4: -8,
  },
  {
    id: 16,
    size: 9,
    x: "44%",
    y: "4%",
    rotate: 0,
    opacity: 0.08,
    filled: false,
    duration: 19,
    delay: 4,
    w1x: -18,
    w1y: -16,
    w2x: 14,
    w2y: -26,
    w3x: -22,
    w3y: -10,
    w4x: 18,
    w4y: -20,
    r1: -26,
    r2: 20,
    r3: -18,
    r4: 16,
  },
  {
    id: 17,
    size: 5,
    x: "2%",
    y: "80%",
    rotate: 45,
    opacity: 0.13,
    filled: true,
    duration: 11,
    delay: 2.5,
    w1x: 22,
    w1y: -12,
    w2x: -14,
    w2y: -24,
    w3x: 18,
    w3y: -8,
    w4x: -10,
    w4y: -28,
    r1: 14,
    r2: -18,
    r3: 20,
    r4: -12,
  },
  {
    id: 18,
    size: 8,
    x: "97%",
    y: "15%",
    rotate: 10,
    opacity: 0.09,
    filled: false,
    duration: 16,
    delay: 0.2,
    w1x: -16,
    w1y: -22,
    w2x: 20,
    w2y: -10,
    w3x: -12,
    w3y: -30,
    w4x: 16,
    w4y: -18,
    r1: -20,
    r2: 14,
    r3: -28,
    r4: 8,
  },
  // ── снежинки — мелкие и хаотичные ────────────────────────────────────────
  {
    id: 19,
    size: 3,
    x: "9%",
    y: "42%",
    rotate: 0,
    opacity: 0.2,
    filled: true,
    duration: 7,
    delay: 0.4,
    w1x: 10,
    w1y: -14,
    w2x: -8,
    w2y: -20,
    w3x: 14,
    w3y: -10,
    w4x: -6,
    w4y: -18,
    r1: 45,
    r2: -30,
    r3: 60,
    r4: 15,
  },
  {
    id: 20,
    size: 4,
    x: "18%",
    y: "22%",
    rotate: 20,
    opacity: 0.18,
    filled: false,
    duration: 9,
    delay: 1.1,
    w1x: -8,
    w1y: -16,
    w2x: 12,
    w2y: -8,
    w3x: -14,
    w3y: -22,
    w4x: 6,
    w4y: -12,
    r1: -45,
    r2: 30,
    r3: -60,
    r4: -15,
  },
  {
    id: 21,
    size: 3,
    x: "31%",
    y: "60%",
    rotate: 45,
    opacity: 0.22,
    filled: true,
    duration: 6,
    delay: 2.7,
    w1x: 14,
    w1y: -10,
    w2x: -10,
    w2y: -18,
    w3x: 8,
    w3y: -6,
    w4x: -12,
    w4y: -14,
    r1: 90,
    r2: 45,
    r3: 135,
    r4: 0,
  },
  {
    id: 22,
    size: 5,
    x: "40%",
    y: "44%",
    rotate: 0,
    opacity: 0.12,
    filled: false,
    duration: 11,
    delay: 0.9,
    w1x: -12,
    w1y: -20,
    w2x: 8,
    w2y: -12,
    w3x: -18,
    w3y: -8,
    w4x: 10,
    w4y: -16,
    r1: 25,
    r2: -20,
    r3: 35,
    r4: -10,
  },
  {
    id: 23,
    size: 3,
    x: "48%",
    y: "78%",
    rotate: 30,
    opacity: 0.19,
    filled: true,
    duration: 8,
    delay: 3.6,
    w1x: 8,
    w1y: -12,
    w2x: -14,
    w2y: -6,
    w3x: 10,
    w3y: -18,
    w4x: -8,
    w4y: -10,
    r1: -60,
    r2: 45,
    r3: -90,
    r4: 30,
  },
  {
    id: 24,
    size: 4,
    x: "53%",
    y: "35%",
    rotate: 10,
    opacity: 0.14,
    filled: false,
    duration: 10,
    delay: 1.3,
    w1x: -10,
    w1y: -18,
    w2x: 16,
    w2y: -8,
    w3x: -12,
    w3y: -24,
    w4x: 8,
    w4y: -14,
    r1: 30,
    r2: -45,
    r3: 20,
    r4: -30,
  },
  {
    id: 25,
    size: 3,
    x: "61%",
    y: "56%",
    rotate: 0,
    opacity: 0.2,
    filled: true,
    duration: 7,
    delay: 0.6,
    w1x: 12,
    w1y: -16,
    w2x: -8,
    w2y: -10,
    w3x: 16,
    w3y: -20,
    w4x: -10,
    w4y: -8,
    r1: 45,
    r2: -60,
    r3: 30,
    r4: -45,
  },
  {
    id: 26,
    size: 5,
    x: "73%",
    y: "28%",
    rotate: 25,
    opacity: 0.12,
    filled: false,
    duration: 12,
    delay: 4.2,
    w1x: -14,
    w1y: -12,
    w2x: 10,
    w2y: -20,
    w3x: -8,
    w3y: -6,
    w4x: 14,
    w4y: -16,
    r1: -30,
    r2: 45,
    r3: -20,
    r4: 30,
  },
  {
    id: 27,
    size: 3,
    x: "80%",
    y: "85%",
    rotate: 45,
    opacity: 0.18,
    filled: true,
    duration: 9,
    delay: 1.9,
    w1x: 8,
    w1y: -18,
    w2x: -12,
    w2y: -8,
    w3x: 14,
    w3y: -14,
    w4x: -8,
    w4y: -20,
    r1: 90,
    r2: -45,
    r3: 60,
    r4: -90,
  },
  {
    id: 28,
    size: 4,
    x: "87%",
    y: "54%",
    rotate: 0,
    opacity: 0.16,
    filled: false,
    duration: 8,
    delay: 0.5,
    w1x: -10,
    w1y: -14,
    w2x: 14,
    w2y: -6,
    w3x: -16,
    w3y: -18,
    w4x: 6,
    w4y: -10,
    r1: -45,
    r2: 60,
    r3: -30,
    r4: 45,
  },
  {
    id: 29,
    size: 3,
    x: "95%",
    y: "72%",
    rotate: 15,
    opacity: 0.21,
    filled: true,
    duration: 6,
    delay: 2.1,
    w1x: 10,
    w1y: -10,
    w2x: -8,
    w2y: -16,
    w3x: 12,
    w3y: -8,
    w4x: -10,
    w4y: -12,
    r1: 60,
    r2: -30,
    r3: 90,
    r4: -60,
  },
  {
    id: 30,
    size: 4,
    x: "33%",
    y: "33%",
    rotate: 35,
    opacity: 0.13,
    filled: false,
    duration: 10,
    delay: 3.3,
    w1x: -8,
    w1y: -20,
    w2x: 12,
    w2y: -10,
    w3x: -14,
    w3y: -16,
    w4x: 8,
    w4y: -8,
    r1: -20,
    r2: 35,
    r3: -15,
    r4: 25,
  },
  {
    id: 31,
    size: 3,
    x: "20%",
    y: "52%",
    rotate: 0,
    opacity: 0.17,
    filled: true,
    duration: 7,
    delay: 1.7,
    w1x: 14,
    w1y: -8,
    w2x: -10,
    w2y: -14,
    w3x: 8,
    w3y: -18,
    w4x: -12,
    w4y: -6,
    r1: 45,
    r2: -90,
    r3: 30,
    r4: -45,
  },
  {
    id: 32,
    size: 5,
    x: "47%",
    y: "20%",
    rotate: 20,
    opacity: 0.11,
    filled: false,
    duration: 13,
    delay: 0.1,
    w1x: -12,
    w1y: -16,
    w2x: 8,
    w2y: -8,
    w3x: -16,
    w3y: -20,
    w4x: 10,
    w4y: -12,
    r1: -25,
    r2: 40,
    r3: -35,
    r4: 20,
  },
  {
    id: 33,
    size: 3,
    x: "64%",
    y: "38%",
    rotate: 0,
    opacity: 0.19,
    filled: true,
    duration: 8,
    delay: 4.8,
    w1x: 10,
    w1y: -12,
    w2x: -14,
    w2y: -6,
    w3x: 8,
    w3y: -16,
    w4x: -6,
    w4y: -10,
    r1: 60,
    r2: -45,
    r3: 75,
    r4: -30,
  },
  {
    id: 34,
    size: 4,
    x: "78%",
    y: "62%",
    rotate: 30,
    opacity: 0.14,
    filled: false,
    duration: 11,
    delay: 2.4,
    w1x: -8,
    w1y: -18,
    w2x: 12,
    w2y: -10,
    w3x: -10,
    w3y: -22,
    w4x: 6,
    w4y: -14,
    r1: -40,
    r2: 55,
    r3: -25,
    r4: 40,
  },
  {
    id: 35,
    size: 3,
    x: "14%",
    y: "6%",
    rotate: 45,
    opacity: 0.2,
    filled: true,
    duration: 6,
    delay: 1.6,
    w1x: 12,
    w1y: -14,
    w2x: -8,
    w2y: -20,
    w3x: 10,
    w3y: -8,
    w4x: -14,
    w4y: -16,
    r1: 90,
    r2: -60,
    r3: 45,
    r4: -90,
  },
  {
    id: 36,
    size: 5,
    x: "58%",
    y: "48%",
    rotate: 0,
    opacity: 0.1,
    filled: false,
    duration: 15,
    delay: 3.8,
    w1x: -14,
    w1y: -10,
    w2x: 10,
    w2y: -18,
    w3x: -8,
    w3y: -6,
    w4x: 12,
    w4y: -14,
    r1: -30,
    r2: 20,
    r3: -45,
    r4: 15,
  },
  {
    id: 37,
    size: 3,
    x: "3%",
    y: "27%",
    rotate: 20,
    opacity: 0.18,
    filled: true,
    duration: 9,
    delay: 5.2,
    w1x: 8,
    w1y: -16,
    w2x: -12,
    w2y: -8,
    w3x: 14,
    w3y: -12,
    w4x: -8,
    w4y: -18,
    r1: 45,
    r2: -30,
    r3: 60,
    r4: -45,
  },
  {
    id: 38,
    size: 4,
    x: "96%",
    y: "56%",
    rotate: 0,
    opacity: 0.15,
    filled: false,
    duration: 10,
    delay: 0.9,
    w1x: -10,
    w1y: -20,
    w2x: 16,
    w2y: -8,
    w3x: -12,
    w3y: -14,
    w4x: 8,
    w4y: -18,
    r1: -60,
    r2: 45,
    r3: -30,
    r4: 60,
  },
];

/* ─── Service chips ──────────────────────────────────────────────────────── */
type Chip = {
  id: number;
  label: string;
  Icon: React.ElementType;
  x: string;
  y: string;
  depth: number;
  floatDelay: string;
  floatDur: string;
  variant: "light" | "dark" | "outline";
};

const chips: Chip[] = [
  // ── правая колонка ──────────────────────────────────────────
  {
    id: 1,
    label: "AI-агенты",
    Icon: Bot,
    x: "62%",
    y: "10%",
    depth: 0.055,
    floatDelay: "0s",
    floatDur: "8s",
    variant: "dark",
  },
  {
    id: 2,
    label: "Разработка",
    Icon: Code2,
    x: "82%",
    y: "18%",
    depth: 0.03,
    floatDelay: "1.2s",
    floatDur: "10s",
    variant: "light",
  },
  {
    id: 3,
    label: "Telegram",
    Icon: MessageSquare,
    x: "60%",
    y: "24%",
    depth: 0.04,
    floatDelay: "0.6s",
    floatDur: "9s",
    variant: "outline",
  },
  {
    id: 4,
    label: "Автоматизация",
    Icon: Settings2,
    x: "88%",
    y: "40%",
    depth: 0.025,
    floatDelay: "2s",
    floatDur: "11s",
    variant: "light",
  },
  {
    id: 5,
    label: "AI-интеграции",
    Icon: Sparkles,
    x: "89%",
    y: "56%",
    depth: 0.05,
    floatDelay: "0.9s",
    floatDur: "9s",
    variant: "dark",
  },
  {
    id: 6,
    label: "CRM / ERP",
    Icon: Database,
    x: "57%",
    y: "73%",
    depth: 0.035,
    floatDelay: "1.7s",
    floatDur: "12s",
    variant: "outline",
  },
  {
    id: 7,
    label: "Маркетплейс",
    Icon: ShoppingBag,
    x: "85%",
    y: "66%",
    depth: 0.04,
    floatDelay: "0.3s",
    floatDur: "10s",
    variant: "light",
  },
  {
    id: 8,
    label: "Аналитика",
    Icon: BarChart3,
    x: "69%",
    y: "80%",
    depth: 0.02,
    floatDelay: "2.6s",
    floatDur: "13s",
    variant: "outline",
  },
  {
    id: 9,
    label: "SEO",
    Icon: TrendingUp,
    x: "91%",
    y: "82%",
    depth: 0.03,
    floatDelay: "1.5s",
    floatDur: "11s",
    variant: "light",
  },
  // ── верхний центр (над текстом) ─────────────────────────────
  {
    id: 10,
    label: "Сайты",
    Icon: Globe,
    x: "54%",
    y: "6%",
    depth: 0.04,
    floatDelay: "0.7s",
    floatDur: "8s",
    variant: "light",
  },
  {
    id: 11,
    label: "Приложения",
    Icon: Layout,
    x: "93%",
    y: "12%",
    depth: 0.05,
    floatDelay: "1.8s",
    floatDur: "9s",
    variant: "outline",
  },
  // ── нижний центр ─────────────────────────────────────────────
];

const variantStyles = {
  light:
    "border border-[#e5e5e5] bg-white text-[#0a0a0a] shadow-[0_2px_12px_rgba(0,0,0,0.06)]",
  dark: "border border-[#0a0a0a] bg-[#0a0a0a] text-white shadow-[0_4px_20px_rgba(0,0,0,0.18)]",
  outline:
    "border border-[#d4d4d4] bg-white/60 text-[#525252] shadow-[0_1px_6px_rgba(0,0,0,0.04)] backdrop-blur-sm",
};

const iconColor = {
  light: "text-[#525252]",
  dark: "text-white/60",
  outline: "text-[#a3a3a3]",
};

/* ─── Keyframes string ───────────────────────────────────────────────────── */
const squareKeyframes = squares
  .map(
    (s) => `
  @keyframes sq-${s.id} {
    0%   { transform: translate(0px, 0px)           rotate(${s.rotate}deg); }
    20%  { transform: translate(${s.w1x}px,${s.w1y}px) rotate(${s.r1}deg); }
    45%  { transform: translate(${s.w2x}px,${s.w2y}px) rotate(${s.r2}deg); }
    70%  { transform: translate(${s.w3x}px,${s.w3y}px) rotate(${s.r3}deg); }
    85%  { transform: translate(${s.w4x}px,${s.w4y}px) rotate(${s.r4}deg); }
    100% { transform: translate(0px, 0px)           rotate(${s.rotate}deg); }
  }
`,
  )
  .join("\n");

const chatFloatKf = `
  @keyframes chat-float {
    0%   { translate: 0px 0px; }
    30%  { translate: 5px -14px; }
    65%  { translate: -4px -20px; }
    100% { translate: 0px 0px; }
  }
`;

/* Per-chip float so each moves differently (x + y drift, not just vertical) */
const chipFloatKf = chips
  .map((c, i) => {
    const xA = [-6, 8, -10, 5, -7, 9, -4, 7, -8, 6, -5, 10][i % 12];
    const yA = [-18, -22, -16, -24, -20, -14, -26, -18, -22, -16, -20, -24][
      i % 12
    ];
    return `
    @keyframes chip-float-${c.id} {
      0%   { translate: 0px 0px;              }
      30%  { translate: ${xA * 0.6}px ${yA * 0.5}px; }
      60%  { translate: ${-xA * 0.4}px ${yA * 0.9}px; }
      100% { translate: 0px 0px;              }
    }
  `;
  })
  .join("\n");

/* ─── Component ─────────────────────────────────────────────────────────── */
const CHAT_DEPTH = 0.08;

export function HeroGeometric() {
  const sectionRef = useRef<HTMLElement>(null);
  const mouse = useRef({ x: 0, y: 0 });
  const lerped = useRef({ x: 0, y: 0 });
  const chipsRef = useRef<(HTMLDivElement | null)[]>([]);
  const chatWrapRef = useRef<HTMLDivElement>(null);
  const chatTiltRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);

  /* ── Entrance animations ── */
  useEffect(() => {
    const root = sectionRef.current;
    if (!root) return;
    const ctx = gsap.context(() => {
      gsap
        .timeline({ delay: 0.1 })
        .fromTo(
          ".hg-badge",
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" },
        )
        .fromTo(
          ".hg-line",
          { yPercent: 115, skewY: 3 },
          {
            yPercent: 0,
            skewY: 0,
            stagger: 0.09,
            duration: 1,
            ease: "power4.out",
          },
          "-=0.3",
        )
        .fromTo(
          ".hg-sub",
          { opacity: 0, y: 18 },
          { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" },
          "-=0.55",
        )
        .fromTo(
          ".hg-cta",
          { opacity: 0, y: 14 },
          {
            opacity: 1,
            y: 0,
            stagger: 0.07,
            duration: 0.6,
            ease: "power3.out",
          },
          "-=0.4",
        )
        .fromTo(
          ".hg-chip",
          { opacity: 0, scale: 0.75, y: 10 },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            stagger: 0.055,
            duration: 0.5,
            ease: "back.out(1.5)",
          },
          "-=0.3",
        )
        .fromTo(
          ".hg-chat, .hg-chat-m",
          { opacity: 0, scale: 0.88, y: 16 },
          { opacity: 1, scale: 1, y: 0, duration: 0.7, ease: "back.out(1.4)" },
          "-=0.35",
        )
        .fromTo(
          ".hg-sq",
          { opacity: 0 },
          { opacity: 1, stagger: 0.03, duration: 0.4, ease: "none" },
          "-=0.4",
        );
    }, root);
    return () => ctx.revert();
  }, []);

  /* ── Mouse parallax ── */
  useEffect(() => {
    const root = sectionRef.current;
    if (!root) return;

    const onMove = (e: MouseEvent) => {
      const r = root.getBoundingClientRect();
      mouse.current.x = (e.clientX - r.left - r.width / 2) / r.width;
      mouse.current.y = (e.clientY - r.top - r.height / 2) / r.height;
    };
    root.addEventListener("mousemove", onMove, { passive: true });

    const tick = () => {
      lerped.current.x = lerp(lerped.current.x, mouse.current.x, 0.065);
      lerped.current.y = lerp(lerped.current.y, mouse.current.y, 0.065);

      chipsRef.current.forEach((el, i) => {
        if (!el) return;
        const chip = chips[i];
        if (!chip) return;
        const dx = lerped.current.x * chip.depth * 460;
        const dy = lerped.current.y * chip.depth * 280;
        el.style.setProperty("--px", `${dx}px`);
        el.style.setProperty("--py", `${dy}px`);
      });

      if (chatWrapRef.current) {
        const dx = lerped.current.x * CHAT_DEPTH * 420;
        const dy = lerped.current.y * CHAT_DEPTH * 260;
        chatWrapRef.current.style.setProperty("--px", `${dx}px`);
        chatWrapRef.current.style.setProperty("--py", `${dy}px`);
      }
      if (chatTiltRef.current) {
        const rx = lerped.current.y * 7;
        const ry = lerped.current.x * -9;
        chatTiltRef.current.style.transform = `rotateX(${2 + rx}deg) rotateY(${-11 + ry}deg)`;
      }

      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      root.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <>
      {/* ── Injected keyframes ── */}
      <style>{squareKeyframes + chipFloatKf + chatFloatKf}</style>

      {/* ── Comparison label ── */}

      <section
        ref={sectionRef}
        className="relative min-h-screen overflow-hidden bg-white"
      >
        {/* ── Background: subtle dot grid ── */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              "radial-gradient(circle, #0a0a0a 1px, transparent 1px)",
            backgroundSize: "36px 36px",
          }}
        />

        {/* ── Chaotic small squares ── */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 overflow-hidden"
        >
          {squares.map((sq) => (
            <div
              key={sq.id}
              className="hg-sq absolute"
              style={{
                left: sq.x,
                top: sq.y,
                width: sq.size,
                height: sq.size,
                border: sq.filled ? "none" : "1.5px solid #0a0a0a",
                background: sq.filled ? "#0a0a0a" : "transparent",
                opacity: sq.opacity,
                animationName: `sq-${sq.id}`,
                animationDuration: `${sq.duration}s`,
                animationDelay: `${sq.delay}s`,
                animationTimingFunction: "ease-in-out",
                animationIterationCount: "infinite",
                animationDirection: "alternate",
                willChange: "transform",
              }}
            />
          ))}
        </div>

        {/* ── Service chips ── */}
        <div aria-hidden className="hidden lg:block pointer-events-none absolute inset-0">
          {chips.map((chip, i) => (
            <div
              key={chip.id}
              ref={(el) => {
                chipsRef.current[i] = el;
              }}
              className="hg-chip absolute"
              style={
                {
                  left: chip.x,
                  top: chip.y,
                  /* base centering + mouse offset via CSS vars */
                  transform:
                    "translate(calc(-50% + var(--px, 0px)), calc(-50% + var(--py, 0px)))",
                  animation: `chip-float-${chip.id} ${chip.floatDur} ${chip.floatDelay} ease-in-out infinite`,
                  willChange: "transform",
                } as React.CSSProperties
              }
            >
              <div
                className={`
                  flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium
                  transition-shadow duration-300
                  ${variantStyles[chip.variant]}
                `}
              >
                <chip.Icon
                  size={15}
                  className={iconColor[chip.variant]}
                  strokeWidth={1.75}
                />
                <span>{chip.label}</span>
              </div>
            </div>
          ))}
        </div>

        {/* ── ChatMock card ── */}
        <div
          ref={chatWrapRef}
          className="hg-chat hidden lg:block pointer-events-none absolute z-10"
          style={
            {
              left: "72%",
              top: "48%",
              width: 300,
              height: 244,
              transform:
                "translate(calc(-50% + var(--px, 0px)), calc(-50% + var(--py, 0px)))",
              animation: "chat-float 12s 0.6s ease-in-out infinite",
              perspective: "900px",
              willChange: "transform",
            } as React.CSSProperties
          }
        >
          <div
            ref={chatTiltRef}
            style={{
              width: "100%",
              height: "100%",
              transform: "rotateX(2deg) rotateY(-11deg)",
              transformStyle: "preserve-3d",
              willChange: "transform",
              filter:
                "drop-shadow(0 16px 48px rgba(0,0,0,0.13)) drop-shadow(0 2px 10px rgba(0,0,0,0.07))",
            }}
          >
            <ChatMock accent="#6e56ff" typing className="h-full rounded-2xl" />
          </div>
        </div>

        {/* ── Content layout: stacked on mobile, centered on desktop ── */}
        <div className="relative z-10 flex min-h-screen flex-col pt-20 pb-8 lg:justify-center lg:pt-36 lg:pb-24">
          <Container>
            <div className="max-w-208">
              {/* Badge */}
              {/* <div className="hg-badge inline-flex items-center gap-2.5 rounded-full border border-[#e8e8e8] bg-white px-4 py-1.5 shadow-sm">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#0a0a0a] opacity-35" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#0a0a0a]" />
                </span>
                <span className="font-mono text-xs tracking-wider text-[#525252]">
                  студия разработки ·
                </span>
              </div> */}

              {/* Heading */}
              <h2 className="mt-8 font-semibold leading-[1.02] tracking-tight text-[#0a0a0a] text-[clamp(2.4rem,7.5vw,6.8rem)]">
                <span className="block overflow-hidden">
                  <span className="hg-line block">Создаем</span>
                </span>
                <span className="block overflow-hidden">
                  <span className="hg-line block">сайты</span>
                </span>
                <span className="block overflow-hidden">
                  <span className="hg-line block text-[#a3a3a3]">и приложения</span>
                </span>
              </h2>

              {/* Subtitle */}
              {/* <p className="hg-sub mt-6 max-w-md text-base sm:text-lg leading-relaxed text-[#525252]">
                Из идеи — в работающий продукт. Сайты, приложения, CRM и AI, которые
                делают бизнес быстрее и прибыльнее.
              </p> */}

              {/* CTAs */}
              <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                <MagneticButton>
                  <Link
                    href="/contact"
                    data-cursor="button"
                    className="hg-cta inline-flex items-center gap-2 rounded-full bg-[#0a0a0a] px-7 py-3.5 text-sm font-medium text-white shadow-[0_4px_20px_rgba(0,0,0,0.16)] transition-all duration-200 hover:bg-[#1a1a1a] hover:shadow-[0_6px_28px_rgba(0,0,0,0.22)]"
                  >
                    Обсудить проект <ArrowRight size={15} />
                  </Link>
                </MagneticButton>
                <MagneticButton>
                  <Link
                    href="/portfolio"
                    data-cursor="link"
                    className="hg-cta inline-flex items-center gap-2 rounded-full border border-[#e5e5e5] bg-white px-7 py-3.5 text-sm font-medium text-[#0a0a0a] shadow-sm transition-all duration-200 hover:border-[#0a0a0a]"
                  >
                    Смотреть работы
                  </Link>
                </MagneticButton>
              </div>
            </div>
          </Container>

          {/* ── Mobile card + chips (< lg) ── */}
          <div className="mt-auto lg:hidden px-5 sm:px-8 pt-8 pb-2">
            <div
              className="relative mx-auto"
              style={{ maxWidth: 320, height: 356 }}
            >
              {/* ambient glow */}
              <div
                className="pointer-events-none absolute inset-0 rounded-3xl opacity-[0.14] blur-3xl"
                style={{ background: "#6e56ff" }}
              />

              {/* ChatMock */}
              <div
                className="hg-chat-m absolute"
                style={{
                  top: 28,
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: 224,
                  height: 186,
                }}
              >
                <ChatMock accent="#6e56ff" typing className="h-full rounded-xl" />
              </div>

              {/* Chip: AI-агенты — top-left */}
              <div
                className="absolute"
                style={{ top: 6, left: 2, animation: "chip-float-1 8s ease-in-out infinite" }}
              >
                <div className="flex items-center gap-1.5 rounded-full border border-[#0a0a0a] bg-[#0a0a0a] px-3 py-1.5 text-xs font-medium text-white shadow-lg">
                  <Bot size={11} className="text-white/60" strokeWidth={1.75} />
                  <span>AI-агенты</span>
                </div>
              </div>

              {/* Chip: Сайты — top-right */}
              <div
                className="absolute"
                style={{ top: 6, right: 2, animation: "chip-float-2 10s 0.5s ease-in-out infinite" }}
              >
                <div className="flex items-center gap-1.5 rounded-full border border-[#e5e5e5] bg-white px-3 py-1.5 text-xs font-medium text-[#0a0a0a] shadow-md">
                  <Globe size={11} className="text-[#525252]" strokeWidth={1.75} />
                  <span>Сайты</span>
                </div>
              </div>

              {/* Chip: Telegram — bottom-left */}
              <div
                className="absolute"
                style={{ bottom: 8, left: 2, animation: "chip-float-3 9s 1s ease-in-out infinite" }}
              >
                <div className="flex items-center gap-1.5 rounded-full border border-[#d4d4d4] bg-white/70 px-3 py-1.5 text-xs font-medium text-[#525252] shadow-sm backdrop-blur-sm">
                  <MessageSquare size={11} className="text-[#a3a3a3]" strokeWidth={1.75} />
                  <span>Telegram</span>
                </div>
              </div>

              {/* Chip: Разработка — bottom-right */}
              <div
                className="absolute"
                style={{ bottom: 8, right: 2, animation: "chip-float-4 11s 1.5s ease-in-out infinite" }}
              >
                <div className="flex items-center gap-1.5 rounded-full border border-[#e5e5e5] bg-white px-3 py-1.5 text-xs font-medium text-[#0a0a0a] shadow-md">
                  <Code2 size={11} className="text-[#525252]" strokeWidth={1.75} />
                  <span>Разработка</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-2 opacity-60 sm:flex">
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-black">
            Скролл
          </span>
          <span className="h-10 w-px bg-linear-to-b from-black to-transparent" />
        </div>
        {/* Bottom fade */}
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-32 bg-linear-to-t from-white to-transparent" />
      </section>
    </>
  );
}
