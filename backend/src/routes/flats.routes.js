import { Router } from "express";
import { requireAuth } from "../auth.js";
import { store } from "../data/store.js";

const router = Router();
router.use(requireAuth);

router.get("/", (req, res) => {
  res.json(store.residents);
});

// Must come before "/:flatNo" or Express would treat "search" as a flat number.
router.get("/search", (req, res) => {
  const flat = String(req.query.flat || "").toLowerCase();
  const match = store.residents.find((r) => r.flat.toLowerCase() === flat);
  if (!match) return res.status(404).json({ message: "Apartment not found." });
  res.json(match);
});

router.post("/advance", (req, res) => {
  const { flat, amount } = req.body || {};
  const amt = Number(amount);
  const resident = store.residents.find((r) => r.flat === flat);

  if (!resident) return res.status(404).json({ message: "Apartment not found." });
  if (!amt || amt <= 0) return res.status(400).json({ message: "Enter a valid amount." });

  resident.advance += amt;
  store.save();
  res.json(resident);
});

router.get("/:flatNo/closing", (req, res) => {
  const resident = store.residents.find((r) => r.flat === req.params.flatNo);
  if (!resident) return res.status(404).json({ message: "Apartment not found." });
  res.json({ flat: resident.flat, closingBalance: resident.due - resident.advance });
});

router.get("/:flatNo", (req, res) => {
  const resident = store.residents.find((r) => r.flat === req.params.flatNo);
  if (!resident) return res.status(404).json({ message: "Apartment not found." });
  res.json(resident);
});

export default router;
