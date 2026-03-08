const BASE_URL = "/api";

export async function checkHealth() {
  const response = await fetch(`${BASE_URL}/health`);

  if (!response.ok) {
    throw new Error("Health check failed");
  }

  return response.json();
}

export async function getDocument() {
  const response = await fetch(`${BASE_URL}/document`);

  if (!response.ok) {
    throw new Error("Failed to fetch document");
  }

  return response.json();
}

export async function analyzeText(text: string) {
  const response = await fetch(`${BASE_URL}/analyze`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      text,
      document_id: "trustops-handbook-v1",
      user_id: "candidate_1",
    }),
  });

  if (!response.ok) {
    throw new Error("Analyze request failed");
  }

  return response.json();
}