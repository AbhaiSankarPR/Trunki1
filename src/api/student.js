export async function joinRoom(roomCode, rollNo) {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/student/join-room`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      room_code: roomCode,
      roll_no: rollNo,
    }),
  });

  if (!res.ok) {
    throw new Error("Failed to join room");
  }

  return res.json();
}
