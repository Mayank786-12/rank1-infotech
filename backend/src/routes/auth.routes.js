import { Router } from "express";
import { findUser, verifyPassword, signToken, toPublicUser, requireAuth } from "../auth.js";

const router = Router();

router.post("/login", (req, res) => {
  const { adminId, password, tenantCode } = req.body || {};

  if (!adminId || !password || !tenantCode) {
    return res.status(400).json({ message: "adminId, password and tenantCode are all required." });
  }

  const user = findUser(adminId, tenantCode);
  if (!user || !verifyPassword(user, password)) {
    // Same message either way - don't reveal whether the ID or the password was wrong.
    return res.status(401).json({ message: "Invalid Admin ID, password, or tenant code." });
  }

  const accessToken = signToken(user);
  res.json({ accessToken, user: toPublicUser(user) });
});

router.get("/me", requireAuth, (req, res) => {
  res.json({ user: req.user });
});

router.post("/logout", requireAuth, (req, res) => {
  // JWTs are stateless, so there's nothing to invalidate server-side here.
  // If you need real revocation (e.g. "log out everywhere"), keep a
  // short-lived denylist of token IDs, or switch to refresh-token rotation.
  res.json({ message: "Logged out." });
});

export default router;
