"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
  HiOutlineAcademicCap,
  HiOutlineSparkles,
  HiOutlineChatBubbleBottomCenterText,
  HiOutlineShieldCheck,
  HiOutlineArrowRight,
} from "react-icons/hi2";

function Features() {
  return (
    <section className="border-t border-white/10 bg-[#2a2826]/30 px-4 py-20">
      <div className="mx-auto max-w-6xl">
        <h2 className="mb-4 text-center font-mono text-3xl font-bold text-white">
          How it Works
        </h2>
        <p className="mb-12 text-center font-mono text-white/50">
          Three simple steps to get your doubts resolved
        </p>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Feature 1 */}
          <Card className="border-white/10 bg-[#2a2826]/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-amber-500/15">
                <HiOutlineChatBubbleBottomCenterText className="h-6 w-6 text-amber-400" />
              </div>
              <h3 className="mb-2 font-mono text-lg font-semibold text-white">
                Ask Your Doubt
              </h3>
              <p className="font-mono text-sm text-white/50">
                Post your academic question with subject and difficulty level.
                Be as specific as you need.
              </p>
            </CardContent>
          </Card>

          {/* Feature 2 */}
          <Card className="border-white/10 bg-[#2a2826]/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-amber-500/15">
                <HiOutlineSparkles className="h-6 w-6 text-amber-400" />
              </div>
              <h3 className="mb-2 font-mono text-lg font-semibold text-white">
                Get AI Answer
              </h3>
              <p className="font-mono text-sm text-white/50">
                Our AI instantly generates a detailed explanation tailored to
                your question and difficulty level.
              </p>
            </CardContent>
          </Card>

          {/* Feature 3 */}
          <Card className="border-white/10 bg-[#2a2826]/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-amber-500/15">
                <HiOutlineShieldCheck className="h-6 w-6 text-amber-400" />
              </div>
              <h3 className="mb-2 font-mono text-lg font-semibold text-white">
                Teacher Verified
              </h3>
              <p className="font-mono text-sm text-white/50">
                Teachers review, approve, or provide better answers. Quality
                guaranteed by human expertise.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}

export default Features;
