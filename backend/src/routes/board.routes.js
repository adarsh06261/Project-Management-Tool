const express = require("express");
const router = express.Router();
const { getAllBoards, getBoard, createBoard } = require("../controllers/board.controller");

router.get("/", getAllBoards);
router.get("/:id", getBoard);
router.post("/", createBoard);

module.exports = router;
