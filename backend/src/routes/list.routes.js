const express = require("express");
const router = express.Router();
const {
  createList,
  updateList,
  deleteList,
  reorderLists
} = require("../controllers/list.controller");

router.post("/", createList);
router.put("/reorder", reorderLists); // Must be before /:id route
router.put("/:id", updateList);
router.delete("/:id", deleteList);

module.exports = router;
