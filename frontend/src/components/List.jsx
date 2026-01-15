import { useState } from "react";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import Card from "./Card";
import { api } from "../api/api";

export default function List({ list, onAddCard, onCardClick, onUpdateList, onDeleteList }) {
  const [editingTitle, setEditingTitle] = useState(false);
  const [titleValue, setTitleValue] = useState(list.title);

  const handleTitleSave = async () => {
    if (titleValue.trim() && titleValue !== list.title) {
      try {
        await api.put(`/lists/${list.id}`, { title: titleValue });
        if (onUpdateList) onUpdateList({ ...list, title: titleValue });
      } catch (err) {
        console.error("Error updating list:", err);
        setTitleValue(list.title);
      }
    }
    setEditingTitle(false);
  };

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete the list "${list.title}"?`)) {
      try {
        await api.delete(`/lists/${list.id}`);
        if (onDeleteList) onDeleteList(list.id);
      } catch (err) {
        console.error("Error deleting list:", err);
        alert("Failed to delete list. Please try again.");
      }
    }
  };

  return (
    <div
      style={{
        width: 272,
        minWidth: 272,
        background: "#f4f5f7",
        borderRadius: 8,
        padding: 12,
        maxHeight: "calc(100vh - 180px)",
        display: "flex",
        flexDirection: "column",
        flexShrink: 0,
      }}
    >
      {/* List Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 12,
        }}
        onMouseDown={(e) => e.stopPropagation()}
      >
        {editingTitle ? (
          <input
            type="text"
            value={titleValue}
            onChange={(e) => setTitleValue(e.target.value)}
            onBlur={handleTitleSave}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleTitleSave();
              if (e.key === "Escape") {
                setTitleValue(list.title);
                setEditingTitle(false);
              }
            }}
            autoFocus
            style={{
              flex: 1,
              fontSize: "16px",
              fontWeight: "bold",
              border: "2px solid #0079bf",
              borderRadius: 4,
              padding: "6px 8px",
              background: "white",
            }}
          />
        ) : (
          <h4
            style={{
              margin: 0,
              fontSize: "16px",
              fontWeight: "bold",
              color: "#172b4d",
              cursor: "pointer",
              flex: 1,
            }}
            onClick={() => setEditingTitle(true)}
          >
            {list.title}
          </h4>
        )}
        <button
          onClick={handleDelete}
          style={{
            background: "none",
            border: "none",
            color: "#6b778c",
            cursor: "pointer",
            fontSize: "18px",
            padding: "4px 8px",
          }}
          title="Delete list"
        >
          ×
        </button>
      </div>

      {/* Cards */}
      <div style={{ flex: 1, overflowY: "auto", marginBottom: 8 }}>
        <SortableContext
          items={list.cards.map((card) => card.id)}
          strategy={verticalListSortingStrategy}
        >
          {list.cards.map((card) => (
            <Card
              key={card.id}
              card={card}
              onClick={() => onCardClick(card)}
            />
          ))}
        </SortableContext>
      </div>

      {/* Add Card Button */}
      <button
        onClick={() => onAddCard(list.id)}
        style={{
          marginTop: "auto",
          padding: "8px 12px",
          borderRadius: 4,
          border: "none",
          cursor: "pointer",
          background: "rgba(255,255,255,0.5)",
          color: "#6b778c",
          fontSize: "14px",
          fontWeight: "500",
          transition: "background 0.2s",
        }}
        onMouseEnter={(e) => (e.target.style.background = "rgba(255,255,255,0.8)")}
        onMouseLeave={(e) => (e.target.style.background = "rgba(255,255,255,0.5)")}
      >
        + Add a card
      </button>
    </div>
  );
}
