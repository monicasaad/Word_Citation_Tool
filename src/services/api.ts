const BASE_URL = "/api";
const ANALYZE_TIMEOUT = 5000;
const CONFIDENCE_THRESHOLD = 0.6;
const DEFAULT_CONFIDENCE = 0.82;

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

interface AnalyzeResponse {
  source_id: string;
  citation_text: string;
  confidence: number;
  url: string;
}

export async function analyzeText(
  text: string,
  document_id?: string,
  user_id?: string
) {
  // Timeout error if response is not received within 5 seconds
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), ANALYZE_TIMEOUT);

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

    // check if response confidence is below CONFIDENCE_THRESHOLD
    const data: AnalyzeResponse = await response.json();
    
    if (
      data.confidence !== undefined &&
      (data.confidence < CONFIDENCE_THRESHOLD || data.confidence === DEFAULT_CONFIDENCE)
    ) {
      throw new Error("NO_MATCHING_SOURCE");
    }

    return data;
  } catch (error: any) {
    if (error.name === "AbortError") {
      throw new Error("ANALYZE_TIMEOUT");
    }
    throw error;
  }
}

export async function highlightSelectedText() {
  return Word.run(async (context) => {
    const selection = context.document.getSelection();
    selection.font.highlightColor = "#FFF59D";

    await context.sync();
  });
}