const express = require("express");
const router = express.Router();
const {
  createList,
  updateList,
  deleteList,
  reorderLists
} = require("../controllers/list.controller");

router.post("/", createList);
router.put("/:id", updateList);
router.delete("/:id", deleteList);
router.put("/reorder", reorderLists);

module.exports = router;
