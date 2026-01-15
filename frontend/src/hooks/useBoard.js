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
        setError(err.message || "Failed to load board");
        setLoading(false);
      });
  }, [boardId]);

  return { board, setBoard, error, loading };
}
