import { Router } from "express";
import { requireAuth } from "../auth.js";
import { store } from "../data/store.js";

const router = Router();
router.use(requireAuth);

router.get("/summary", (req, res) => {
  const { residents, payments, baselines } = store;

  const overdue = residents.reduce((a, r) => a + r.due, 0);
  const collection =
    baselines.collectionBase + payments.filter((p) => p.status === "Success").reduce((a, p) => a + p.amount, 0);

  res.json({
    totalCollection: collection,
    totalOutstanding: baselines.outstandingDisplay,
    overdueAmount: overdue + baselines.overdueBase,
    collectionEfficiency: baselines.efficiency,
    categoryBreakdown: baselines.categoryBreakdown,
    paymentModeBreakdown: baselines.paymentModeBreakdown,
  });
});

export default router;
