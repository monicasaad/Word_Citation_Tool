const BASE_URL = "/api";

export async function checkHealth() {
  const response = await fetch(`${BASE_URL}/health`);

  if (!response.ok) {
    throw new Error(`Health check failed with status ${response.status}`);
  }

  return response.json();
}

export async function getDocument() {
  const response = await fetch(`${BASE_URL}/document`);

  if (!response.ok) {
    throw new Error(`Failed to fetch document with status ${response.status}`);
  }

  return response.json();
}

interface AnalyzeRequest {
  text: string;
  document_id?: string;
  user_id?: string;
}

export async function analyzeText(
  text: string,
  document_id?: string,
  user_id?: string
) {
  // Timeout error if response is not received within 5 seconds
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5000);

  const body: AnalyzeRequest = { text };

  if (document_id) body.document_id = document_id;
  if (user_id) body.user_id = user_id;

  try {
    const response = await fetch(`${BASE_URL}/analyze`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Analyze request failed with status ${response.status}`);
    }

    return response.json();
  } catch (error: any) {
    if (error.name === "AbortError") {
      throw new Error("Analyze request timed out after 5 seconds.");
    }
    throw error;
  }
}