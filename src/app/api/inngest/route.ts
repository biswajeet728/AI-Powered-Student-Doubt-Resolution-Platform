import { serve } from "inngest/next";
import { inngest } from "@/inngest/client";
import {
  generateAIResponse,
  generateAIResponseFailure,
} from "@/inngest/functions/generate-ai-response";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [generateAIResponse, generateAIResponseFailure],
});
