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

    // Validate all list IDs exist
    const listIds = lists.map(l => l.id).filter(id => id != null);
    if (listIds.length === 0) {
      return res.status(400).json({ error: "No valid list IDs provided" });
    }

    // Update lists one by one to handle errors better
    const updates = [];
    for (let index = 0; index < lists.length; index++) {
      const list = lists[index];
      if (!list.id) {
        console.warn(`Skipping list at index ${index}: missing id`);
        continue;
      }
      
      try {
        const updated = await prisma.list.update({
          where: { id: list.id },
          data: { position: index + 1 }
        });
        console.log(`Successfully updated list ${list.id} to position ${index + 1}`);
        updates.push(list.id);
      } catch (updateError) {
        console.error(`Error updating list ${list.id}:`, updateError);
        console.error(`Error code: ${updateError.code}, message: ${updateError.message}`);
        // Continue with other updates even if one fails
      }
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: "No lists were updated" });
    }

    res.json({ success: true, updated: updates.length });
  } catch (error) {
    console.error("Error reordering lists:", error);
    console.error("Error details:", error.message, error.code);
    res.status(500).json({ 
      error: "Failed to reorder lists",
      message: error.message 
    });
  }
};
