const prisma = require("../prisma");

exports.getLabels = async (req, res) => {
  const labels = await prisma.label.findMany({
    orderBy: { id: "asc" },
  });
  res.json(labels);
};

exports.createLabel = async (req, res) => {
  const { name, color } = req.body;

  const label = await prisma.label.create({
    data: { name, color },
  });

  res.json(label);
};

exports.addLabelToCard = async (req, res) => {
  const { cardId, labelId } = req.body;

  const cardLabel = await prisma.cardLabel.create({
    data: { cardId, labelId },
    include: { label: true },
  });

  res.json(cardLabel);
};

exports.removeLabelFromCard = async (req, res) => {
  const { cardId, labelId } = req.body;

  await prisma.cardLabel.deleteMany({
    where: { cardId, labelId },
  });

  res.json({ success: true });
};

