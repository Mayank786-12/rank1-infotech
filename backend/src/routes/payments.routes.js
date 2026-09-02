import { Router } from "express";
import { requireAuth } from "../auth.js";
import { store } from "../data/store.js";

const router = Router();
router.use(requireAuth);

router.post("/", (req, res) => {
  const { flat, amount, mode = "UPI" } = req.body || {};
  const amt = Number(amount);
  const resident = store.residents.find((r) => r.flat === flat);

  if (!resident) return res.status(404).json({ message: "Apartment not found." });
  if (!amt || amt <= 0) return res.status(400).json({ message: "Enter a valid amount." });

  resident.due = Math.max(0, resident.due - amt);

  const payment = {
    id: "PAY-" + Date.now(),
    date: new Date().toLocaleString("en-IN"),
    flat: resident.flat,
    resident: resident.resident,
    category: resident.category,
    amount: amt,
    mode,
    status: "Success",
  };
  store.payments.unshift(payment);
  store.save();

  res.json({ payment, resident });
});

router.get("/", (req, res) => {
  const { status } = req.query;
  const list = status ? store.payments.filter((p) => p.status === status) : store.payments;
  res.json(list);
});

export default router;
