import { Router } from "express";
import { requireAuth } from "../auth.js";
import { store } from "../data/store.js";

const router = Router();
router.use(requireAuth);

router.get("/overdue", (req, res) => {
  res.json(store.residents.filter((r) => r.due > 0));
});

export default router;
