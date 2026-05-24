export async function getChatHistory({ doubtId }: { doubtId: string }) {
  try {
    const response = await fetch(`/api/chat?doubtId=${doubtId}`);
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to load chat history");
    }

    const messages = await response.json();
    return { success: true, messages };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to load chat history";
    return { success: false, error: message };
  }
}

export async function sendChatMessage({
  doubtId,
  message,
}: {
  doubtId: string;
  message: string;
}) {
  const response = await fetch("/api/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ doubtId, message }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to send chat message");
  }

  // Return the raw response so the caller can read the stream
  return response;
}
