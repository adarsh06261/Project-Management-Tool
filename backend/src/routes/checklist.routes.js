const router = require("express").Router();
const {
  createChecklistItem,
  updateChecklistItem,
  deleteChecklistItem,
} = require("../controllers/checklist.controller");

router.post("/", createChecklistItem);
router.put("/:id", updateChecklistItem);
router.delete("/:id", deleteChecklistItem);

module.exports = router;

