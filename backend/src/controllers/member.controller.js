const prisma = require("../prisma");

exports.getMembers = async (req, res) => {
  const members = await prisma.member.findMany({
    orderBy: { name: "asc" },
  });
  res.json(members);
};

exports.createMember = async (req, res) => {
  const { name, email, avatar } = req.body;

  const member = await prisma.member.create({
    data: { name, email, avatar },
  });

  res.json(member);
};

exports.assignMemberToCard = async (req, res) => {
  const { cardId, memberId } = req.body;

  const cardMember = await prisma.cardMember.create({
    data: { cardId, memberId },
    include: { member: true },
  });

  res.json(cardMember);
};

exports.removeMemberFromCard = async (req, res) => {
  const { cardId, memberId } = req.body;

  await prisma.cardMember.deleteMany({
    where: { cardId, memberId },
  });

  res.json({ success: true });
};

