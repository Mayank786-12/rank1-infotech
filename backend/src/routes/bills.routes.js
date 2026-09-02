import { Router } from "express";
import { requireAuth } from "../auth.js";
import { store } from "../data/store.js";

const router = Router();
router.use(requireAuth);

router.post("/generate", (req, res) => {
  const { flat, e = 0, m = 0, ev = 0, road = 0, other = 0 } = req.body || {};
  const resident = store.residents.find((r) => r.flat === flat);

  if (!resident) return res.status(404).json({ message: "Apartment not found." });

  const amount = Math.max(
    0,
    Number(e) + Number(m) + Number(ev) + Number(road) + Number(other) + resident.due - resident.advance
  );

  resident.bill = amount;
  resident.due = amount;
  resident.advance = 0;

  const bill = {
    id: "INV-" + Date.now(),
    flat: resident.flat,
    resident: resident.resident,
    amount,
    date: new Date().toISOString(),
  };
  store.bills.unshift(bill);
  store.save();

  res.json({ bill, resident });
});

router.get("/", (req, res) => {
  res.json(store.bills);
});

export default router;
