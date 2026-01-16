import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export default function Card({ card, onClick }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: card.id });

  const style = {
    transform: isDragging 
      ? `${CSS.Transform.toString(transform)} rotate(3deg) scale(1.05)` 
      : CSS.Transform.toString(transform),
    transition: isDragging ? undefined : transition,
    background: "white",
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    cursor: isDragging ? "grabbing" : "grab",
    boxShadow: isDragging 
      ? "0 8px 16px rgba(0,0,0,0.4), 0 0 0 2px #0079bf" 
      : "0 1px 3px rgba(0,0,0,0.12)",
    opacity: isDragging ? 0.8 : 1,
    zIndex: isDragging ? 1000 : 1,
    border: isDragging ? "2px solid #0079bf" : "1px solid transparent",
    userSelect: "none",
  };

  const labels = card.labels || [];
  const members = card.cardMembers || [];
  const dueDate = card.dueDate ? new Date(card.dueDate) : null;
  const isOverdue = dueDate && dueDate < new Date() && !card.checklistItems?.every(item => item.completed);

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={onClick}
    >
      {/* Labels */}
      {labels.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 8 }}>
          {labels.map((cardLabel) => (
            <div
              key={cardLabel.id}
              style={{
                background: cardLabel.label.color,
                height: 8,
                borderRadius: 4,
                minWidth: 40,
              }}
              title={cardLabel.label.name}
            />
          ))}
        </div>
      )}

      {/* Card Title */}
      <div style={{ marginBottom: 8, fontSize: "14px", color: "#172b4d" }}>
        {card.title}
      </div>

      {/* Footer with due date and members */}
      {(dueDate || members.length > 0) && (
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 8 }}>
          {dueDate && (
            <div
              style={{
                fontSize: "12px",
                color: isOverdue ? "#eb5a46" : "#6b778c",
                display: "flex",
                alignItems: "center",
                gap: 4,
              }}
            >
              📅 {dueDate.toLocaleDateString()}
            </div>
          )}
          {members.length > 0 && (
            <div style={{ display: "flex", gap: -4, marginLeft: "auto" }}>
              {members.slice(0, 3).map((cardMember) => (
                <div
                  key={cardMember.id}
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: "50%",
                    background: "#dfe1e6",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "12px",
                    color: "#172b4d",
                    border: "2px solid white",
                    marginLeft: -4,
                  }}
                  title={cardMember.member.name}
                >
                  {cardMember.member.avatar ? (
                    <img
                      src={cardMember.member.avatar}
                      alt={cardMember.member.name}
                      style={{ width: "100%", height: "100%", borderRadius: "50%" }}
                    />
                  ) : (
                    cardMember.member.name.charAt(0).toUpperCase()
                  )}
                </div>
              ))}
              {members.length > 3 && (
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: "50%",
                    background: "#dfe1e6",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "10px",
                    color: "#172b4d",
                    border: "2px solid white",
                    marginLeft: -4,
                  }}
                >
                  +{members.length - 3}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
