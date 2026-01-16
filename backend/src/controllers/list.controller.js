const prisma = require("../prisma");

exports.createList = async (req, res) => {
  try {
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
  } catch (error) {
    console.error("Error creating list:", error);
    res.status(500).json({ error: "Failed to create list" });
  }
};

exports.updateList = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { title } = req.body;

    const list = await prisma.list.update({
      where: { id },
      data: { title }
    });

    res.json(list);
  } catch (error) {
    console.error("Error updating list:", error);
    res.status(500).json({ error: "Failed to update list" });
  }
};

exports.deleteList = async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    await prisma.list.delete({ where: { id } });
    res.json({ success: true });
  } catch (error) {
    console.error("Error deleting list:", error);
    res.status(500).json({ error: "Failed to delete list" });
  }
};

exports.reorderLists = async (req, res) => {
  try {
    const { lists } = req.body;

    if (!lists || !Array.isArray(lists)) {
      return res.status(400).json({ error: "Lists array is required" });
    }

    const updates = lists.map((list, index) =>
      prisma.list.update({
        where: { id: list.id },
        data: { position: index + 1 }
      })
    );

    await Promise.all(updates);
    res.json({ success: true });
  } catch (error) {
    console.error("Error reordering lists:", error);
    res.status(500).json({ error: "Failed to reorder lists" });
  }
};
