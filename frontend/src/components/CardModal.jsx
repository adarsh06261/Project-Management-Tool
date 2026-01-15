import { useState, useEffect } from "react";
import { api } from "../api/api";

export default function CardModal({ card, onClose, onUpdate }) {
  const [cardData, setCardData] = useState(card);
  const [labels, setLabels] = useState([]);
  const [members, setMembers] = useState([]);
  const [newChecklistItem, setNewChecklistItem] = useState("");
  const [editingTitle, setEditingTitle] = useState(false);
  const [titleValue, setTitleValue] = useState(card?.title || "");

  useEffect(() => {
    if (card) {
      setCardData(card);
      setTitleValue(card.title);
      fetchLabels();
      fetchMembers();
    }
  }, [card]);

  const fetchLabels = async () => {
    try {
      const res = await api.get("/labels");
      setLabels(res.data);
    } catch (err) {
      console.error("Error fetching labels:", err);
    }
  };

  const fetchMembers = async () => {
    try {
      const res = await api.get("/members");
      setMembers(res.data);
    } catch (err) {
      console.error("Error fetching members:", err);
    }
  };

  const updateCard = async (data) => {
    try {
      const res = await api.put(`/cards/${card.id}`, data);
      setCardData(res.data);
      if (onUpdate) onUpdate(res.data);
    } catch (err) {
      console.error("Error updating card:", err);
    }
  };

  const handleTitleSave = () => {
    if (titleValue.trim()) {
      updateCard({ title: titleValue });
    }
    setEditingTitle(false);
  };

  const handleDescriptionChange = (e) => {
    updateCard({ description: e.target.value });
  };

  const handleDueDateChange = (e) => {
    const date = e.target.value ? new Date(e.target.value).toISOString() : null;
    updateCard({ dueDate: date });
  };

  const toggleLabel = async (labelId) => {
    const hasLabel = cardData.labels?.some((cl) => cl.labelId === labelId);
    try {
      if (hasLabel) {
        await api.delete("/labels/card", { data: { cardId: card.id, labelId } });
      } else {
        await api.post("/labels/card", { cardId: card.id, labelId });
      }
      const res = await api.get(`/cards/${card.id}`);
      setCardData(res.data);
      if (onUpdate) onUpdate(res.data);
    } catch (err) {
      console.error("Error toggling label:", err);
    }
  };

  const toggleMember = async (memberId) => {
    const hasMember = cardData.cardMembers?.some((cm) => cm.memberId === memberId);
    try {
      if (hasMember) {
        await api.delete("/members/card", { data: { cardId: card.id, memberId } });
      } else {
        await api.post("/members/card", { cardId: card.id, memberId });
      }
      const res = await api.get(`/cards/${card.id}`);
      setCardData(res.data);
      if (onUpdate) onUpdate(res.data);
    } catch (err) {
      console.error("Error toggling member:", err);
    }
  };

  const addChecklistItem = async () => {
    if (!newChecklistItem.trim()) return;
    try {
      await api.post("/checklist", { cardId: card.id, title: newChecklistItem });
      const res = await api.get(`/cards/${card.id}`);
      setCardData(res.data);
      setNewChecklistItem("");
      if (onUpdate) onUpdate(res.data);
    } catch (err) {
      console.error("Error adding checklist item:", err);
    }
  };

  const toggleChecklistItem = async (itemId, completed) => {
    try {
      await api.put(`/checklist/${itemId}`, { completed: !completed });
      const res = await api.get(`/cards/${card.id}`);
      setCardData(res.data);
      if (onUpdate) onUpdate(res.data);
    } catch (err) {
      console.error("Error updating checklist item:", err);
    }
  };

  const deleteChecklistItem = async (itemId) => {
    try {
      await api.delete(`/checklist/${itemId}`);
      const res = await api.get(`/cards/${card.id}`);
      setCardData(res.data);
      if (onUpdate) onUpdate(res.data);
    } catch (err) {
      console.error("Error deleting checklist item:", err);
    }
  };

  const deleteCard = async () => {
    if (window.confirm("Are you sure you want to delete this card?")) {
      try {
        await api.delete(`/cards/${card.id}`);
        onClose();
        if (onUpdate) onUpdate(null);
      } catch (err) {
        console.error("Error deleting card:", err);
      }
    }
  };

  const archiveCard = async () => {
    try {
      await updateCard({ archived: true });
      onClose();
      if (onUpdate) onUpdate(null);
    } catch (err) {
      console.error("Error archiving card:", err);
    }
  };

  if (!card) return null;

  const cardLabels = cardData.labels || [];
  const cardMembers = cardData.cardMembers || [];
  const checklistItems = cardData.checklistItems || [];
  const completedCount = checklistItems.filter((item) => item.completed).length;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        padding: "20px",
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "white",
          width: "95%",
          maxWidth: "768px",
          maxHeight: "90vh",
          borderRadius: 8,
          padding: "clamp(16px, 3vw, 24px)",
          overflowY: "auto",
          boxShadow: "0 8px 16px rgba(0,0,0,0.2)",
          margin: "20px",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
          {editingTitle ? (
            <input
              type="text"
              value={titleValue}
              onChange={(e) => setTitleValue(e.target.value)}
              onBlur={handleTitleSave}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleTitleSave();
                if (e.key === "Escape") {
                  setTitleValue(card.title);
                  setEditingTitle(false);
                }
              }}
              autoFocus
              style={{
                fontSize: "20px",
                fontWeight: "bold",
                border: "2px solid #0079bf",
                borderRadius: 4,
                padding: "8px",
                width: "100%",
              }}
            />
          ) : (
            <h2
              style={{ fontSize: "20px", fontWeight: "bold", cursor: "pointer", margin: 0 }}
              onClick={() => setEditingTitle(true)}
            >
              {cardData.title}
            </h2>
          )}
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              fontSize: "24px",
              cursor: "pointer",
              padding: "4px 8px",
            }}
          >
            ×
          </button>
        </div>

        {/* Labels */}
        <div style={{ marginBottom: 16 }}>
          <h3 style={{ fontSize: "14px", fontWeight: "bold", marginBottom: 8 }}>Labels</h3>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {labels.map((label) => {
              const isSelected = cardLabels.some((cl) => cl.labelId === label.id);
              return (
                <button
                  key={label.id}
                  onClick={() => toggleLabel(label.id)}
                  style={{
                    background: isSelected ? label.color : "#e4e6ea",
                    color: isSelected ? "white" : "#172b4d",
                    border: "none",
                    borderRadius: 4,
                    padding: "6px 12px",
                    fontSize: "12px",
                    cursor: "pointer",
                    fontWeight: isSelected ? "bold" : "normal",
                  }}
                >
                  {label.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Description */}
        <div style={{ marginBottom: 16 }}>
          <h3 style={{ fontSize: "14px", fontWeight: "bold", marginBottom: 8 }}>Description</h3>
          <textarea
            defaultValue={cardData.description || ""}
            onBlur={handleDescriptionChange}
            placeholder="Add a more detailed description..."
            style={{
              width: "100%",
              minHeight: "80px",
              padding: "8px",
              border: "1px solid #dfe1e6",
              borderRadius: 4,
              fontSize: "14px",
              fontFamily: "inherit",
              resize: "vertical",
            }}
          />
        </div>

        {/* Due Date */}
        <div style={{ marginBottom: 16 }}>
          <h3 style={{ fontSize: "14px", fontWeight: "bold", marginBottom: 8 }}>Due Date</h3>
          <input
            type="datetime-local"
            defaultValue={
              cardData.dueDate
                ? new Date(cardData.dueDate).toISOString().slice(0, 16)
                : ""
            }
            onChange={handleDueDateChange}
            style={{
              padding: "8px",
              border: "1px solid #dfe1e6",
              borderRadius: 4,
              fontSize: "14px",
            }}
          />
        </div>

        {/* Members */}
        <div style={{ marginBottom: 16 }}>
          <h3 style={{ fontSize: "14px", fontWeight: "bold", marginBottom: 8 }}>Members</h3>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {members.map((member) => {
              const isAssigned = cardMembers.some((cm) => cm.memberId === member.id);
              return (
                <div
                  key={member.id}
                  onClick={() => toggleMember(member.id)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "6px 12px",
                    background: isAssigned ? "#e4e6ea" : "transparent",
                    border: `2px solid ${isAssigned ? "#0079bf" : "#dfe1e6"}`,
                    borderRadius: 4,
                    cursor: "pointer",
                  }}
                >
                  {member.avatar && (
                    <img
                      src={member.avatar}
                      alt={member.name}
                      style={{ width: 24, height: 24, borderRadius: "50%" }}
                    />
                  )}
                  <span style={{ fontSize: "14px" }}>{member.name}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Checklist */}
        <div style={{ marginBottom: 16 }}>
          <h3 style={{ fontSize: "14px", fontWeight: "bold", marginBottom: 8 }}>
            Checklist ({completedCount}/{checklistItems.length})
          </h3>
          <div style={{ marginBottom: 8 }}>
            {checklistItems.map((item) => (
              <div
                key={item.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: 8,
                }}
              >
                <input
                  type="checkbox"
                  checked={item.completed}
                  onChange={() => toggleChecklistItem(item.id, item.completed)}
                  style={{ cursor: "pointer" }}
                />
                <span
                  style={{
                    flex: 1,
                    textDecoration: item.completed ? "line-through" : "none",
                    color: item.completed ? "#6b778c" : "#172b4d",
                  }}
                >
                  {item.title}
                </span>
                <button
                  onClick={() => deleteChecklistItem(item.id)}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#6b778c",
                    cursor: "pointer",
                    fontSize: "18px",
                  }}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <input
              type="text"
              value={newChecklistItem}
              onChange={(e) => setNewChecklistItem(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") addChecklistItem();
              }}
              placeholder="Add an item..."
              style={{
                flex: 1,
                padding: "8px",
                border: "1px solid #dfe1e6",
                borderRadius: 4,
                fontSize: "14px",
              }}
            />
            <button
              onClick={addChecklistItem}
              style={{
                padding: "8px 16px",
                background: "#0079bf",
                color: "white",
                border: "none",
                borderRadius: 4,
                cursor: "pointer",
                fontSize: "14px",
              }}
            >
              Add
            </button>
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: "flex", gap: 8, marginTop: 24 }}>
          <button
            onClick={archiveCard}
            style={{
              padding: "8px 16px",
              background: "#eb5a46",
              color: "white",
              border: "none",
              borderRadius: 4,
              cursor: "pointer",
              fontSize: "14px",
            }}
          >
            Archive
          </button>
          <button
            onClick={deleteCard}
            style={{
              padding: "8px 16px",
              background: "#eb5a46",
              color: "white",
              border: "none",
              borderRadius: 4,
              cursor: "pointer",
              fontSize: "14px",
            }}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
