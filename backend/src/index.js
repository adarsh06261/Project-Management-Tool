const express = require("express");
const cors = require("cors");

const boardRoutes = require("./routes/board.routes");
const listRoutes = require("./routes/list.routes");
const cardRoutes = require("./routes/card.routes");
const labelRoutes = require("./routes/label.routes");
const checklistRoutes = require("./routes/checklist.routes");
const memberRoutes = require("./routes/member.routes");

const app = express();

// Async error wrapper
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true
}));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend is running");
});

// Health check endpoint
app.get("/health", async (req, res) => {
  try {
    // Test database connection
    const prisma = require("./prisma");
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: "ok", database: "connected" });
  } catch (error) {
    console.error("Health check failed:", error);
    res.status(503).json({ status: "error", database: "disconnected", error: error.message });
  }
});

app.use("/boards", boardRoutes);
app.use("/lists", listRoutes);
app.use("/cards", cardRoutes);
app.use("/labels", labelRoutes);
app.use("/checklist", checklistRoutes);
app.use("/members", memberRoutes);

// Error handling middleware (must be last)
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  console.error("Error stack:", err.stack);
  res.status(err.status || 500).json({ 
    error: err.message || "Internal server error",
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

const PORT = process.env.PORT || 5001; // Render uses PORT env var (set to 10000 in render.yaml)

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
