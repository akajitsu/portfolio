"use client";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { Check, Copy } from "@/components/ui/Icons";

export default function CopyEmail({ email }: { email: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      window.location.href = `mailto:${email}`;
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      className="inline-flex h-12 items-center gap-2 rounded-full border border-line bg-card/60 px-5 text-sm font-medium backdrop-blur transition-colors duration-300 hover:border-ink"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={copied ? "y" : "n"}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.2 }}
          className="inline-flex items-center gap-2"
        >
          {copied ? <Check size={16} className="text-emerald-600" /> : <Copy size={16} />}
          {copied ? "Copied!" : "Copy email"}
        </motion.span>
      </AnimatePresence>
      <span className="sr-only" aria-live="polite">
        {copied ? "Email address copied to clipboard" : ""}
      </span>
    </button>
  );
}
