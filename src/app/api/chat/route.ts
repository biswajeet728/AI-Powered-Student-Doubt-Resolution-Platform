import { getServerSession } from "@/lib/get-sessions";
import prisma from "@/lib/prisma";
import OpenAI from "openai";

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});

export async function GET(request: Request) {
  const session = await getServerSession();
  if (!session?.user) {
    return new Response(JSON.stringify({ error: "Not authenticated" }), {
      status: 401,
    });
  }

  const { searchParams } = new URL(request.url);
  const doubtId = searchParams.get("doubtId");

  if (!doubtId) {
    return new Response(JSON.stringify({ error: "doubtId is required" }), {
      status: 400,
    });
  }

  try {
    const messages = await prisma.chatMessage.findMany({
      where: { doubtId, userId: session.user.id },
      orderBy: { createdAt: "asc" },
    });

    return new Response(JSON.stringify(messages), { status: 200 });
  } catch (error) {
    console.error("Failed to load chat history:", error);
    return new Response(
      JSON.stringify({ error: "Failed to load chat history" }),
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  const session = await getServerSession();
  if (!session?.user) {
    return new Response(JSON.stringify({ error: "Not authenticated" }), {
      status: 401,
    });
  }

  const { doubtId, message } = await request.json();

  if (!doubtId || !message?.trim()) {
    return new Response(
      JSON.stringify({ error: "doubtId and message are required" }),
      { status: 400 },
    );
  }

  try {
    const doubt = await prisma.doubt.findUnique({
      where: { id: doubtId },
      include: {
        subject: { select: { name: true } },
        user: { select: { name: true } },
        responses: {
          where: {
            NOT: { content: { startsWith: "__DISAPPROVED__:" } },
          },
          orderBy: { createdAt: "asc" },
        },
      },
    });

    if (!doubt) {
      return new Response(JSON.stringify({ error: "Doubt not found" }), {
        status: 404,
      });
    }

    const chatHistory = await prisma.chatMessage.findMany({
      where: { doubtId, userId: session.user.id },
      orderBy: { createdAt: "asc" },
    });

    const responsesContext = doubt.responses
      .map((r, i) => {
        const source =
          r.source === "TEACHER" ? "Teacher-written" : "AI-generated";
        const approved = r.approved ? " (Approved)" : " (Pending review)";
        return `Response ${i + 1} [${source}${approved}]:\n${r.content}`;
      })
      .join("\n\n---\n\n");

    // system prompt
    const systemPrompt = `You are an expert academic tutor helping a student understand a doubt and its answer. And your name is DoubtFlowGPT. Follow these rules when responding:

                RULES:
                1. Help the student understand the doubt and all provided answers
                2. Only discuss topics related to this doubt
                3. If an answer was written by a teacher, do not contradict it — help clarify it instead
                4. If an answer was AI-generated and you find errors, point them out politely
                5. If there are multiple answers, help the student understand the differences and which is more reliable
                6. If you are unsure about something, say "I'm not confident about this, please ask your teacher"
                7. If the question is off-topic, guide the student to focus on the current doubt
                8. Use Markdown formatting when helpful (code blocks, lists, bold, etc.)
                9. Keep responses short and digestible — 3-6 sentences max for simple questions, up to 2-3 short paragraphs for complex ones. Avoid long walls of text.
                10. Get to the point immediately. No filler phrases like "Great question!" or "Let me explain."
                11. If the student asks something simple, give a simple answer. Don't over-explain.

                CONTEXT:
                - Student: ${doubt.user.name}
                - Subject: ${doubt.subject?.name || "General"}
                - Difficulty: ${doubt.difficulty}
                - Doubt Title: ${doubt.title}
                - Doubt Details: ${doubt.body}

                Answers:
                ${responsesContext || "No answers yet."}`;

    const llmMessages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
      { role: "system", content: systemPrompt },
      ...chatHistory.map((msg) => ({
        role: msg.role === "USER" ? ("user" as const) : ("assistant" as const),
        content: msg.content,
      })),
      { role: "user", content: message.trim() },
    ];

    await prisma.chatMessage.create({
      data: {
        role: "USER",
        content: message.trim(),
        userId: session.user.id,
        doubtId,
      },
    });

    const stream = await openai.chat.completions.create({
      model: "openai/gpt-oss-120b:free",
      temperature: 0.5,
      max_tokens: 500,
      stream: true,
      messages: llmMessages,
    });

    let fullResponse = "";

    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const token = chunk.choices[0]?.delta?.content;
            if (token) {
              fullResponse += token;
              controller.enqueue(new TextEncoder().encode(token));
            }
          }

          await prisma.chatMessage.create({
            data: {
              role: "ASSISTANT",
              content: fullResponse,
              userId: session.user.id,
              doubtId,
            },
          });

          controller.close();
        } catch (error) {
          console.error("Streaming error:", error);

          if (fullResponse) {
            await prisma.chatMessage.create({
              data: {
                role: "ASSISTANT",
                content: fullResponse + "\n\n_(Response interrupted)_",
                userId: session.user.id,
                doubtId,
              },
            });
          }

          controller.error(error);
        }
      },
    });

    return new Response(readableStream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Transfer-Encoding": "chunked",
      },
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to process chat message" }),
      { status: 500 },
    );
  }
}
