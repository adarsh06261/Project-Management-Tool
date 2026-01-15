import { useEffect, useState } from "react";
import Board from "./components/Board";
import { useBoard } from "./hooks/useBoard";
import { api } from "./api/api";

export default function App() {
  const [boards, setBoards] = useState([]);
  const [selectedBoardId, setSelectedBoardId] = useState(1);
  const { board, error, loading, setBoard } = useBoard(selectedBoardId);

  useEffect(() => {
    fetchBoards();
  }, []);

  const fetchBoards = async () => {
    try {
      const res = await api.get("/boards");
      setBoards(res.data);
      if (res.data.length > 0 && !selectedBoardId) {
        setSelectedBoardId(res.data[0].id);
      }
    } catch (err) {
      console.error("Error fetching boards:", err);
    }
  };

  const createBoard = async () => {
    const title = prompt("Enter board title:");
    if (!title?.trim()) return;

    try {
      const res = await api.post("/boards", { title: title.trim() });
      setBoards([...boards, res.data]);
      setSelectedBoardId(res.data.id);
    } catch (err) {
      console.error("Error creating board:", err);
      alert("Failed to create board. Please try again.");
    }
  };

  const handleBoardUpdate = (updatedBoard) => {
    if (updatedBoard) {
      setBoard(updatedBoard);
    }
  };

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#0079bf",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          fontSize: "24px",
          fontWeight: "bold",
        }}
      >
        ⏳ Loading Trello Board...
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#0079bf",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          padding: 20,
        }}
      >
        <h2>Error loading board</h2>
        <p style={{ marginTop: 10 }}>{error}</p>
        <p style={{ marginTop: 10, fontSize: "14px" }}>
          Make sure the backend server is running on http://localhost:5001
        </p>
      </div>
    );
  }

  if (!board) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#0079bf",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
        }}
      >
        Board not found. Please check if board ID {selectedBoardId} exists in the database.
      </div>
    );
  }

  return (
    <div style={{ 
      minHeight: "100vh", 
      width: "100%",
      background: "#0079bf",
      display: "flex",
      flexDirection: "column",
    }}>
      {/* Header */}
      <div
        style={{
          background: "rgba(0,0,0,0.15)",
          padding: "12px 16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          color: "white",
          flexWrap: "wrap",
          gap: 12,
          width: "100%",
        }}
      >
        <div style={{ 
          display: "flex", 
          alignItems: "center", 
          gap: 12,
          flexWrap: "wrap",
          flex: 1,
          minWidth: 0,
        }}>
          <h2 style={{ 
            margin: 0, 
            fontSize: "clamp(16px, 2vw, 20px)", 
            fontWeight: "bold",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}>
            {board.title}
          </h2>
          <select
            value={selectedBoardId}
            onChange={(e) => setSelectedBoardId(parseInt(e.target.value))}
            style={{
              padding: "6px 12px",
              borderRadius: 4,
              border: "none",
              background: "rgba(255,255,255,0.2)",
              color: "white",
              fontSize: "14px",
              cursor: "pointer",
              minWidth: 120,
            }}
          >
            {boards.map((b) => (
              <option key={b.id} value={b.id} style={{ color: "#172b4d" }}>
                {b.title}
              </option>
            ))}
          </select>
          <button
            onClick={createBoard}
            style={{
              padding: "6px 12px",
              background: "rgba(255,255,255,0.2)",
              color: "white",
              border: "none",
              borderRadius: 4,
              cursor: "pointer",
              fontSize: "14px",
              whiteSpace: "nowrap",
            }}
          >
            + New Board
          </button>
        </div>
      </div>

      <Board board={board} onBoardUpdate={handleBoardUpdate} />
    </div>
  );
}
