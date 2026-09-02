import { Router } from "express";
import { requireAuth } from "../auth.js";
import { store } from "../data/store.js";

const router = Router();
router.use(requireAuth);

router.get("/:type", (req, res) => {
  if (req.params.type !== "billing") {
    return res.status(404).json({ message: "Unknown report type." });
  }

  const rows = [
    ["Flat", "Resident", "Bill", "Due", "Advance", "Category"],
    ...store.residents.map((r) => [r.flat, r.resident, r.bill, r.due, r.advance, r.category]),
  ];
  const csv = rows.map((r) => r.join(",")).join("\n");

  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", "attachment; filename=rank1-billing-report.csv");
  res.send(csv);
});

export default router;
