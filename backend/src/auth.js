import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-me";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "2h";

// A real app would look this up in a users table (e.g. SQL Server via EF Core).
// The password is bcrypt-hashed even here, in memory, so plaintext is never
// compared directly - swap this for a DB lookup and the rest stays the same.
const users = [
  {
    id: "USR-1",
    adminId: process.env.SEED_ADMIN_ID || "admin",
    passwordHash: bcrypt.hashSync(process.env.SEED_ADMIN_PASSWORD || "Rank1@2026", 10),
    tenantCode: process.env.SEED_TENANT_CODE || "DLF-PARK-PLACE",
    name: "Admin",
    role: "SUPER_ADMIN",
  },
];

export function findUser(adminId, tenantCode) {
  return users.find(
    (u) =>
      u.adminId.toLowerCase() === String(adminId || "").toLowerCase() &&
      u.tenantCode.toLowerCase() === String(tenantCode || "").toLowerCase()
  );
}

export function verifyPassword(user, password) {
  return bcrypt.compareSync(password || "", user.passwordHash);
}

export function toPublicUser(user) {
  return { id: user.id, adminId: user.adminId, name: user.name, role: user.role, tenantCode: user.tenantCode };
}

export function signToken(user) {
  return jwt.sign(toPublicUser(user), JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

// Route middleware: requires a valid "Authorization: Bearer <token>" header.
export function requireAuth(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ message: "Missing or invalid Authorization header." });
  }

  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch (err) {
    return res.status(401).json({ message: "Session expired. Please log in again." });
  }
}

// Role-based authorization example - use like requireRole('SUPER_ADMIN', 'ACCOUNTANT')
export function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: "You don't have permission to do this." });
    }
    next();
  };
}
