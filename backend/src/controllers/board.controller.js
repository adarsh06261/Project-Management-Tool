const prisma = require("../prisma");

exports.createBoard = async (req, res) => {
  const { title } = req.body;

  const board = await prisma.board.create({
    data: { title }
  });

  res.json(board);
};

exports.getBoard = async (req, res) => {
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

  res.json(board);
};

exports.getAllBoards = async (req, res) => {
  const boards = await prisma.board.findMany({
    orderBy: { id: "asc" },
  });
  res.json(boards);
};
