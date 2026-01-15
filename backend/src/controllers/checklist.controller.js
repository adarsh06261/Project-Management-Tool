const prisma = require("../prisma");

exports.createChecklistItem = async (req, res) => {
  const { cardId, title } = req.body;

  const count = await prisma.checklistItem.count({ where: { cardId } });

  const item = await prisma.checklistItem.create({
    data: {
      cardId,
      title,
      position: count + 1,
    },
  });

  res.json(item);
};

exports.updateChecklistItem = async (req, res) => {
  const id = parseInt(req.params.id);
  const { title, completed } = req.body;

  const updateData = {};
  if (title !== undefined) updateData.title = title;
  if (completed !== undefined) updateData.completed = completed;

  const item = await prisma.checklistItem.update({
    where: { id },
    data: updateData,
  });

  res.json(item);
};

exports.deleteChecklistItem = async (req, res) => {
  const id = parseInt(req.params.id);

  await prisma.checklistItem.delete({ where: { id } });
  res.json({ success: true });
};

