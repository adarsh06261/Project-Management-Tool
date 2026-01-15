const router = require("express").Router();
const {
  getMembers,
  createMember,
  assignMemberToCard,
  removeMemberFromCard,
} = require("../controllers/member.controller");

router.get("/", getMembers);
router.post("/", createMember);
router.post("/card", assignMemberToCard);
router.delete("/card", removeMemberFromCard);

module.exports = router;

