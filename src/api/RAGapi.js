const API_BASE = import.meta.env.VITE_API_URL;

export async function askRAG(question) {
  const res = await fetch(`${API_BASE}/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question }),
  });

  if (!res.ok) throw new Error("API error");
  return res.json();
}
