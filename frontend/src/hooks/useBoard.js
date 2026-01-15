import { useEffect, useState } from "react";
import { api } from "../api/api";

export function useBoard(boardId) {
  const [board, setBoard] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    setError(null);
    api.get(`/boards/${boardId}`)
      .then(res => {
        setBoard(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching board:", err);
        console.error("API URL being used:", import.meta.env.VITE_API_URL || "http://localhost:5001");
        console.error("Full error:", err.response?.data || err.message);
        setError(err.message || "Network Error");
        setLoading(false);
      });
  }, [boardId]);

  return { board, setBoard, error, loading };
}
