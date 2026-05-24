"use client";

import Link from "next/link";
import { HiOutlineSparkles, HiOutlineArrowRight } from "react-icons/hi2";

import { Button } from "@/components/ui/button";

function Hero() {
  return (
    <section className="flex flex-1 items-center justify-center px-4 py-20">
      <div className="mx-auto max-w-4xl text-center">
        {/* Badge */}
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-2">
          <HiOutlineSparkles className="h-4 w-4 text-amber-400" />
          <span className="font-mono text-xs text-amber-400">
            AI-Powered Learning
          </span>
        </div>

        {/* Heading */}
        <h1 className="font-mono text-4xl font-bold leading-tight text-white md:text-6xl">
          Get Instant Answers to{" "}
          <span className="text-amber-400">Your Doubts</span>
        </h1>

        {/* Subtitle */}
        <p className="mx-auto mt-6 max-w-2xl font-mono text-lg text-white/60">
          Post your academic doubts, get AI-generated explanations, chat with
          DoubtFlowGPT and have teachers review and approve the best answers.
          Learning made simple.
        </p>

        {/* CTA Buttons */}
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link href="/sign-up">
            <Button
              size="sm"
              className="font-mono bg-amber-500 text-black hover:bg-amber-400 py-5 px-4 text-base cursor-pointer"
            >
              Start Learning
              <HiOutlineArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button
              variant="outline"
              size="sm"
              className="font-mono border-white/20 bg-white/5 text-white hover:bg-white/10 hover:text-white py-5 px-4 text-base cursor-pointer"
            >
              Browse Doubts
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

export default Hero;
