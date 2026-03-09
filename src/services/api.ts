const BASE_URL = "/api";
const ANALYZE_TIMEOUT_MS = 5000;
const CONFIDENCE_THRESHOLD = 0.6;
const DEFAULT_CONFIDENCE = 0.82;

// Request & response interface definitions
export interface HealthResponse {
  ok: boolean;
  service: string;
}

export interface DocumentSection {
  section_id: number;
  heading: string;
  text: string;
}

export interface DocumentResponse {
  document_id: string;
  title: string;
  author: string;
  url: string;
  date: string;
  sections: DocumentSection[];
}

export interface AnalyzeRequest {
  text: string;
  document_id?: string;
  user_id?: string;
}

export interface AnalyzeResponse {
  source_id: string;
  citation_text: string;
  confidence: number;
  url: string;
}

/**
 * Checks whether the backend citation service is reachable.
 *
 * @returns A promise resolving to the health response from the service.
 */
export async function checkHealth(): Promise<HealthResponse> {
  const response = await fetch(`${BASE_URL}/health`);

  if (!response.ok) {
    throw new Error(`Health check failed with status ${response.status}`);
  }

  return response.json() as Promise<HealthResponse>;
}

/**
 * Retrieves metadata for the source document exposed by the backend.
 *
 * @returns A promise resolving to the document metadata including sections.
 */
export async function getDocument(): Promise<DocumentResponse> {
  const response = await fetch(`${BASE_URL}/document`);

  if (!response.ok) {
    throw new Error(`Failed to fetch document with status ${response.status}`);
  }

  return response.json();
}

/**
 * Sends selected text to the analyze endpoint and returns citation data.
 *
 * This function also enforces additional validation rules:
 * - The request is aborted if it exceeds the configured timeout.
 * - The response confidence score must meet the required threshold.
 *
 * @param text - The selected document text to analyze.
 * @param document_id - Optional identifier of the document context for the analysis.
 * @param user_id - Optional identifier for the requesting user.
 *
 * @returns A promise resolving to the analyzed citation data.
 *
 * @throws Error "ANALYZE_TIMEOUT" if the request exceeds the configured timeout.
 * @throws Error "NO_MATCHING_SOURCE" if the confidence score is below the required threshold
 *         or matches the known default fallback confidence.
 */
export async function analyzeText(
  text: string,
  document_id?: string,
  user_id?: string
): Promise<AnalyzeResponse> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), ANALYZE_TIMEOUT_MS);

  const requestBody: AnalyzeRequest = { text };

  if (document_id) {
    requestBody.document_id = document_id;
  }

  if (user_id) {
    requestBody.user_id = user_id;
  }

  try {
    const response = await fetch(`${BASE_URL}/analyze`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Analyze request failed with status ${response.status}`);
    }

    const data: AnalyzeResponse = await response.json();
    
    // Handle low confidence
    if (
      data.confidence < CONFIDENCE_THRESHOLD || data.confidence === DEFAULT_CONFIDENCE
    ) {
      throw new Error("NO_MATCHING_SOURCE");
    }

    return data;
  } catch (error: unknown) {
    // Handle request timeout
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error("ANALYZE_TIMEOUT");
    }

    throw error;
  } finally {
    // Timeout gets cleared whether the request succeeds or fails
    clearTimeout(timeoutId);
  }
}