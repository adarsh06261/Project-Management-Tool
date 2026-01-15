const router = require("express").Router();
const {
  createCard,
  getCard,
  updateCard,
  deleteCard,
  moveCard,
  searchCards,
} = require("../controllers/card.controller");

router.post("/", createCard);
router.get("/search", searchCards);
router.get("/:id", getCard);
router.put("/:id", updateCard);
router.delete("/:id", deleteCard);
router.put("/:id/move", moveCard);

module.exports = router;
