import { inngest } from "../client";
import prisma from "@/lib/prisma";
import OpenAI from "openai";

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});

async function callAI(doubt: {
  title: string;
  body: string;
  difficulty: string;
  subject: string | null;
}): Promise<string> {
  const difficultyContext =
    {
      EASY: "Explain simply with basic concepts. Use examples.",
      MEDIUM: "Provide a balanced explanation with some depth and examples.",
      HARD: "Give a detailed, technical explanation with advanced concepts and edge cases.",
    }[doubt.difficulty] || "Provide a clear explanation.";

  const systemPrompt = `You are an expert academic tutor helping students resolve their doubts.
${difficultyContext}
Format your response using Markdown. Use code blocks, lists, and formatting as needed.
Be clear, concise, and educational.
Current date and time: ${new Date().toUTCString()}`;

  const userPrompt = doubt.subject
    ? `Subject: ${doubt.subject}\n\nQuestion: ${doubt.title}\n\n${doubt.body}`
    : `Question: ${doubt.title}\n\n${doubt.body}`;

  const response = await openai.chat.completions.create({
    model: "openai/gpt-oss-120b:free",
    temperature: 0.5,
    max_tokens: 1500,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
  });

  return (
    response.choices[0]?.message?.content || "Unable to generate a response."
  );
}

// ── Inngest Function: Generate AI Response ──────────────────────────
export const generateAIResponse = inngest.createFunction(
  {
    id: "generate-ai-response",
    name: "Generate AI Response",
    concurrency: { limit: 5 },
    triggers: [{ event: "doubt.created" }],
  },
  async ({ event, step }) => {
    const { doubtId } = event.data;

    // Step 1: Fetch full doubt from DB
    const doubt = await step.run("fetch-doubt", async () => {
      const d = await prisma.doubt.findUnique({
        where: { id: doubtId },
        select: {
          id: true,
          title: true,
          body: true,
          difficulty: true,
          subject: { select: { name: true } },
        },
      });

      if (!d) {
        throw new Error(`Doubt ${doubtId} not found`);
      }

      return {
        title: d.title,
        body: d.body,
        difficulty: d.difficulty,
        subject: d.subject?.name || null,
      };
    });

    // Step 2: Generate AI response
    const aiContent = await step.run("generate-response", async () => {
      return await callAI(doubt);
    });

    // Step 3: Save response and update doubt status (with idempotency check)
    await step.run("save-response", async () => {
      // Idempotency: don't create duplicate AI responses
      const existing = await prisma.response.findFirst({
        where: { doubtId, source: "AI" },
      });

      if (existing) {
        return { skipped: true, reason: "AI response already exists" };
      }

      await prisma.response.create({
        data: {
          content: aiContent,
          source: "AI",
          doubtId,
        },
      });

      await prisma.doubt.update({
        where: { id: doubtId },
        data: { status: "UNDER_REVIEW" },
      });

      return { skipped: false };
    });

    return { success: true, doubtId, responseLength: aiContent.length };
  },
);

// ── On Failure: Save error response so student isn't stuck ──────────
export const generateAIResponseFailure = inngest.createFunction(
  {
    id: "generate-ai-response-failure",
    name: "Handle AI Response Failure",
    triggers: [
      {
        event: "inngest/function.failed",
        match: { "data.function_id": "generate-ai-response" },
      },
    ],
  },
  async ({ event }) => {
    const { doubtId } = event.data.event.data;
    const errorMessage = event.data.error?.message || "Unknown error";

    await prisma.response.create({
      data: {
        content: `__DISAPPROVED__:Unable to generate an AI answer at this time. A teacher will respond to your doubt soon. (Error: ${errorMessage})`,
        source: "AI",
        doubtId,
      },
    });
  },
);
