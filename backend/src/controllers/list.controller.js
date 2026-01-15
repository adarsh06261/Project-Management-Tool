const prisma = require("../prisma");

exports.createList = async (req, res) => {
  const { title, boardId } = req.body;

  const count = await prisma.list.count({ where: { boardId } });

  const list = await prisma.list.create({
    data: {
      title,
      boardId,
      position: count + 1
    }
  });

  res.json(list);
};

exports.updateList = async (req, res) => {
  const id = parseInt(req.params.id);
  const { title } = req.body;

  const list = await prisma.list.update({
    where: { id },
    data: { title }
  });

  res.json(list);
};

exports.deleteList = async (req, res) => {
  const id = parseInt(req.params.id);

  await prisma.list.delete({ where: { id } });
  res.json({ success: true });
};

exports.reorderLists = async (req, res) => {
  const { lists } = req.body;

  const updates = lists.map((list, index) =>
    prisma.list.update({
      where: { id: list.id },
      data: { position: index + 1 }
    })
  );

  await Promise.all(updates);
  res.json({ success: true });
};
