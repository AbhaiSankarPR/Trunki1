const API_BASE = import.meta.env.VITE_API_URL;

export async function createRoom(token) {
  const res = await fetch(`${API_BASE}/teacher/create-room`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to create room");
  }

  return res.json();
}
