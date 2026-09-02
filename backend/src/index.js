import "dotenv/config";
import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";
import flatsRoutes from "./routes/flats.routes.js";
import billsRoutes from "./routes/bills.routes.js";
import paymentsRoutes from "./routes/payments.routes.js";
import duesRoutes from "./routes/dues.routes.js";
import reportsRoutes from "./routes/reports.routes.js";

const app = express();
const PORT = process.env.PORT || 4000;

app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
  })
);
app.use(express.json());

app.get("/api/health", (req, res) => res.json({ status: "ok" }));

app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/flats", flatsRoutes);
app.use("/api/bills", billsRoutes);
app.use("/api/payments", paymentsRoutes);
app.use("/api/dues", duesRoutes);
app.use("/api/reports", reportsRoutes);

// Fallback error handler so an unexpected error never crashes the process mid-request
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: "Something went wrong on the server." });
});

app.listen(PORT, () => {
  console.log(`Rank1 backend listening on http://localhost:${PORT}`);
});
