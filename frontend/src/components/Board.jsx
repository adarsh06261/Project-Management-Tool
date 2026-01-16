import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, DragOverlay } from "@dnd-kit/core";
import { SortableContext, horizontalListSortingStrategy, arrayMove } from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import List from "./List";
import CardModal from "./CardModal";
import Card from "./Card";
import { api } from "../api/api";
import { useState, useEffect } from "react";

function SortableList({ list, onCardClick, onAddCard, onUpdateList, onDeleteList, onCardUpdate }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: list.id });

  const style = {
    transform: isDragging ? undefined : CSS.Transform.toString(transform),
    transition: isDragging ? undefined : transition,
    opacity: isDragging ? 0.3 : 1,
    cursor: isDragging ? 'grabbing' : 'grab',
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      {...attributes} 
      {...listeners}
      onMouseDown={(e) => {
        // Don't allow dragging if clicking on cards, inputs, buttons, or list title
        if (e.target.closest('[data-card-container]') || 
            e.target.closest('input, button') ||
            e.target.closest('h4')) {
          e.stopPropagation();
        }
      }}
    >
      <List
        list={list}
        onCardClick={onCardClick}
        onAddCard={onAddCard}
        onUpdateList={onUpdateList}
        onDeleteList={onDeleteList}
      />
    </div>
  );
}

export default function Board({ board, onBoardUpdate }) {
  const [lists, setLists] = useState(board.lists || []);
  const [selectedCard, setSelectedCard] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddList, setShowAddList] = useState(false);
  const [newListTitle, setNewListTitle] = useState("");
  const [activeId, setActiveId] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  useEffect(() => {
    setLists(board.lists || []);
  }, [board]);

  const handleCardDragEnd = ({ active, over }) => {
    if (!over) return;

    let fromList, toList, card;
    
    for (const list of lists) {
      const foundCard = list.cards.find((c) => c.id === active.id);
      if (foundCard) {
        fromList = list;
        card = foundCard;
        break;
      }
    }

    if (lists.some((l) => l.id === over.id)) {
      toList = lists.find((l) => l.id === over.id);
    } else {
      for (const list of lists) {
        if (list.cards.some((c) => c.id === over.id)) {
          toList = list;
          break;
        }
      }
    }

    if (!fromList || !toList || !card) return;

    // Update local state
    const newLists = lists.map((list) => {
      if (list.id === fromList.id) {
        return {
          ...list,
          cards: list.cards.filter((c) => c.id !== card.id),
        };
      }
      if (list.id === toList.id) {
        const newCards = [...list.cards];
        const overIndex = newCards.findIndex((c) => c.id === over.id);
        if (overIndex >= 0) {
          newCards.splice(overIndex, 0, { ...card, listId: toList.id });
        } else {
          newCards.push({ ...card, listId: toList.id });
        }
        return { ...list, cards: newCards };
      }
      return list;
    });

    setLists(newLists);

    const position = toList.cards.findIndex((c) => c.id === over.id) + 1;
    api.put(`/cards/${card.id}/move`, {
      listId: toList.id,
      position: position || 1,
    }).catch((err) => {
      console.error("Error moving card:", err);
      setLists(lists);
    });
  };

  const handleListDragEnd = ({ active, over }) => {
    if (!over || active.id === over.id) return;

    const oldIndex = lists.findIndex((l) => l.id === active.id);
    const newIndex = lists.findIndex((l) => l.id === over.id);

    if (oldIndex === -1 || newIndex === -1) return;

    const newLists = arrayMove(lists, oldIndex, newIndex);
    setLists(newLists);

    api.put("/lists/reorder", { lists: newLists.map((l, i) => ({ id: l.id, position: i + 1 })) }).catch((err) => {
      console.error("Error reordering lists:", err);
      setLists(lists);
    });
  };

  const addCard = (listId) => {
    const title = prompt("Enter card title:");
    if (!title?.trim()) return;

    api
      .post("/cards", { title: title.trim(), listId })
      .then((res) => {
        setLists((prevLists) =>
          prevLists.map((list) =>
            list.id === listId
              ? { ...list, cards: [res.data, ...list.cards] }
              : list
          )
        );
      })
      .catch((err) => {
        console.error("Error creating card:", err);
        alert("Failed to create card. Please try again.");
      });
  };

  const addList = async () => {
    if (!newListTitle.trim()) {
      setShowAddList(false);
      return;
    }

    try {
      const res = await api.post("/lists", {
        title: newListTitle.trim(),
        boardId: board.id,
      });
      setLists([...lists, { ...res.data, cards: [] }]);
      setNewListTitle("");
      setShowAddList(false);
    } catch (err) {
      console.error("Error creating list:", err);
      alert("Failed to create list. Please try again.");
    }
  };

  const updateList = (updatedList) => {
    setLists((prevLists) =>
      prevLists.map((list) => (list.id === updatedList.id ? updatedList : list))
    );
  };

  const deleteList = (listId) => {
    setLists((prevLists) => prevLists.filter((list) => list.id !== listId));
  };

  const handleCardUpdate = async (updatedCard) => {
    if (!updatedCard) {
      const listId = selectedCard?.listId;
      setLists((prevLists) =>
        prevLists.map((list) =>
          list.id === listId
            ? { ...list, cards: list.cards.filter((c) => c.id !== selectedCard.id) }
            : list
        )
      );
      setSelectedCard(null);
      return;
    }

    try {
      const res = await api.get(`/cards/${updatedCard.id}`);
      const refreshedCard = res.data;
      
      setLists((prevLists) =>
        prevLists.map((list) =>
          list.id === refreshedCard.listId
            ? {
                ...list,
                cards: list.cards.map((c) =>
                  c.id === refreshedCard.id ? refreshedCard : c
                ),
              }
            : list
        )
      );
      setSelectedCard(refreshedCard);
    } catch (err) {
      console.error("Error refreshing card:", err);
    }
  };

  const filteredLists = searchQuery
    ? lists.map((list) => ({
        ...list,
        cards: list.cards.filter((card) =>
          card.title.toLowerCase().includes(searchQuery.toLowerCase())
        ),
      })).filter((list) => list.cards.length > 0)
    : lists;

  return (
    <>
      {/* Search Bar */}
      <div style={{ 
        padding: "12px 16px", 
        background: "rgba(255,255,255,0.1)",
        width: "100%",
      }}>
        <input
          type="text"
          placeholder="Search cards..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            width: "100%",
            maxWidth: 500,
            padding: "8px 12px",
            borderRadius: 4,
            border: "none",
            fontSize: "14px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          }}
        />
      </div>

      {/* Lists Container */}
      <div style={{
        flex: 1,
        width: "100%",
        overflowX: "auto",
        overflowY: "hidden",
        paddingBottom: 16,
        WebkitOverflowScrolling: "touch",
      }}>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={(event) => {
            setActiveId(event.active.id);
          }}
          onDragEnd={(event) => {
            setActiveId(null);
            const isList = lists.some((l) => l.id === event.active.id);
            if (isList) {
              handleListDragEnd(event);
            } else {
              handleCardDragEnd(event);
            }
          }}
          onDragCancel={() => {
            setActiveId(null);
          }}
        >
          <div
            style={{
              display: "flex",
              gap: 12,
              padding: "16px",
              minHeight: "calc(100vh - 180px)",
              width: "max-content",
              minWidth: "100%",
              alignItems: "flex-start",
            }}
          >
          <SortableContext
            items={lists.map((l) => l.id)}
            strategy={horizontalListSortingStrategy}
          >
            {filteredLists.map((list) => (
              <SortableList
                key={list.id}
                list={list}
                onCardClick={setSelectedCard}
                onAddCard={addCard}
                onUpdateList={updateList}
                onDeleteList={deleteList}
                onCardUpdate={handleCardUpdate}
              />
            ))}
          </SortableContext>

          <DragOverlay>
            {activeId ? (() => {
              const isList = lists.some((l) => l.id === activeId);
              if (isList) {
                const list = lists.find((l) => l.id === activeId);
                return list ? (
                  <div style={{ 
                    width: 272, 
                    minWidth: 272, 
                    opacity: 0.95,
                    boxShadow: '0 8px 16px rgba(0,0,0,0.2)',
                    borderRadius: 8,
                  }}>
                    <List list={list} onCardClick={() => {}} onAddCard={() => {}} onUpdateList={() => {}} onDeleteList={() => {}} />
                  </div>
                ) : null;
              } else {
                // Find the card
                let card = null;
                for (const list of lists) {
                  const foundCard = list.cards.find((c) => c.id === activeId);
                  if (foundCard) {
                    card = foundCard;
                    break;
                  }
                }
                return card ? (
                  <div style={{ 
                    width: 256, 
                    opacity: 0.95,
                    boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                  }}>
                    <Card card={card} onClick={() => {}} />
                  </div>
                ) : null;
              }
            })() : null}
          </DragOverlay>

          {/* Add List Button */}
          {!showAddList ? (
            <button
              onClick={() => setShowAddList(true)}
              style={{
                minWidth: 272,
                width: 272,
                height: 40,
                background: "rgba(255,255,255,0.2)",
                border: "none",
                borderRadius: 8,
                color: "white",
                fontSize: "14px",
                fontWeight: "500",
                cursor: "pointer",
                padding: "12px",
                whiteSpace: "nowrap",
                flexShrink: 0,
              }}
            >
              + Add another list
            </button>
          ) : (
            <div
              style={{
                minWidth: 272,
                width: 272,
                background: "#f4f5f7",
                borderRadius: 8,
                padding: 12,
                flexShrink: 0,
              }}
            >
              <input
                type="text"
                value={newListTitle}
                onChange={(e) => setNewListTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") addList();
                  if (e.key === "Escape") {
                    setShowAddList(false);
                    setNewListTitle("");
                  }
                }}
                placeholder="Enter list title..."
                autoFocus
                style={{
                  width: "100%",
                  padding: "8px",
                  border: "2px solid #0079bf",
                  borderRadius: 4,
                  fontSize: "14px",
                  marginBottom: 8,
                }}
              />
              <div style={{ display: "flex", gap: 8 }}>
                <button
                  onClick={addList}
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
                  Add List
                </button>
                <button
                  onClick={() => {
                    setShowAddList(false);
                    setNewListTitle("");
                  }}
                  style={{
                    padding: "8px 16px",
                    background: "transparent",
                    color: "#6b778c",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "14px",
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
          </div>
        </DndContext>
      </div>

      {/* Card Modal */}
      {selectedCard && (
        <CardModal
          card={selectedCard}
          onClose={() => setSelectedCard(null)}
          onUpdate={handleCardUpdate}
        />
      )}
    </>
  );
}
