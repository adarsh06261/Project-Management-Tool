const prisma = require("../prisma");

exports.createCard = async (req, res) => {
  const { title, listId } = req.body;

  const count = await prisma.card.count({ where: { listId, archived: false } });

  const card = await prisma.card.create({
    data: {
      title,
      listId,
      position: count + 1,
    },
    include: {
      labels: { include: { label: true } },
      checklistItems: { orderBy: { position: "asc" } },
      cardMembers: { include: { member: true } },
    },
  });

  res.json(card);
};

exports.getCard = async (req, res) => {
  const cardId = parseInt(req.params.id);

  const card = await prisma.card.findUnique({
    where: { id: cardId },
    include: {
      labels: { include: { label: true } },
      checklistItems: { orderBy: { position: "asc" } },
      cardMembers: { include: { member: true } },
    },
  });

  res.json(card);
};

exports.updateCard = async (req, res) => {
  const cardId = parseInt(req.params.id);
  const { title, description, dueDate, archived } = req.body;

  const updateData = {};
  if (title !== undefined) updateData.title = title;
  if (description !== undefined) updateData.description = description;
  if (dueDate !== undefined) updateData.dueDate = dueDate ? new Date(dueDate) : null;
  if (archived !== undefined) updateData.archived = archived;

  const card = await prisma.card.update({
    where: { id: cardId },
    data: updateData,
    include: {
      labels: { include: { label: true } },
      checklistItems: { orderBy: { position: "asc" } },
      cardMembers: { include: { member: true } },
    },
  });

  res.json(card);
};

exports.deleteCard = async (req, res) => {
  const cardId = parseInt(req.params.id);

  await prisma.card.delete({ where: { id: cardId } });
  res.json({ success: true });
};

exports.moveCard = async (req, res) => {
  const cardId = Number(req.params.id);
  const { listId, position } = req.body;

  const card = await prisma.card.update({
    where: { id: cardId },
    data: {
      listId,
      position,
    },
    include: {
      labels: { include: { label: true } },
      checklistItems: { orderBy: { position: "asc" } },
      cardMembers: { include: { member: true } },
    },
  });

  res.json(card);
};

exports.searchCards = async (req, res) => {
  const { q, labelId, memberId, dueDate } = req.query;
  const boardId = parseInt(req.query.boardId);

  const where = {
    archived: false,
    list: { boardId },
  };

  if (q) {
    where.title = { contains: q, mode: "insensitive" };
  }

  if (labelId) {
    where.labels = { some: { labelId: parseInt(labelId) } };
  }

  if (memberId) {
    where.cardMembers = { some: { memberId: parseInt(memberId) } };
  }

  if (dueDate) {
    where.dueDate = { lte: new Date(dueDate) };
  }

  const cards = await prisma.card.findMany({
    where,
    include: {
      list: true,
      labels: { include: { label: true } },
      checklistItems: true,
      cardMembers: { include: { member: true } },
    },
    orderBy: { position: "asc" },
  });

  res.json(cards);
};
