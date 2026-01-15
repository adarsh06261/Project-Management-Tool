const router = require("express").Router();
const {
  getLabels,
  createLabel,
  addLabelToCard,
  removeLabelFromCard,
} = require("../controllers/label.controller");

router.get("/", getLabels);
router.post("/", createLabel);
router.post("/card", addLabelToCard);
router.delete("/card", removeLabelFromCard);

module.exports = router;

