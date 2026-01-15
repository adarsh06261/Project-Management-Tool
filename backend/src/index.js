const express = require("express");
const cors = require("cors");

const boardRoutes = require("./routes/board.routes");
const listRoutes = require("./routes/list.routes");
const cardRoutes = require("./routes/card.routes");
const labelRoutes = require("./routes/label.routes");
const checklistRoutes = require("./routes/checklist.routes");
const memberRoutes = require("./routes/member.routes");

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true
}));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend is running");
});

app.use("/boards", boardRoutes);
app.use("/lists", listRoutes);
app.use("/cards", cardRoutes);
app.use("/labels", labelRoutes);
app.use("/checklist", checklistRoutes);
app.use("/members", memberRoutes);

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
