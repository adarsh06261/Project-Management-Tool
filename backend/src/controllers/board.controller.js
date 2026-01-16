const prisma = require("../prisma");

exports.createBoard = async (req, res) => {
  try {
  const { title } = req.body;

  const board = await prisma.board.create({
    data: { title }
  });

  res.json(board);
  } catch (error) {
    console.error("Error creating board:", error);
    res.status(500).json({ error: "Failed to create board" });
  }
};

exports.getBoard = async (req, res) => {
  try {
  const boardId = parseInt(req.params.id);

  const board = await prisma.board.findUnique({
    where: { id: boardId },
    include: {
      lists: {
        orderBy: { position: "asc" },
        include: {
          cards: {
            where: { archived: false },
            orderBy: { position: "asc" },
            include: {
              labels: { include: { label: true } },
              checklistItems: { orderBy: { position: "asc" } },
              cardMembers: { include: { member: true } },
            },
          },
        },
      },
    },
  });

    if (!board) {
      return res.status(404).json({ error: "Board not found" });
    }

  res.json(board);
  } catch (error) {
    console.error("Error fetching board:", error);
    res.status(500).json({ error: "Failed to fetch board" });
  }
};

exports.getAllBoards = async (req, res) => {
  try {
  const boards = await prisma.board.findMany({
    orderBy: { id: "asc" },
  });
  res.json(boards);
  } catch (error) {
    console.error("Error fetching boards:", error);
    res.status(500).json({ error: "Failed to fetch boards" });
  }
};
