import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_FILE = path.join(__dirname, "db.json");

const seedResidents = [
  { flat: "A-102", resident: "Rohit Sharma", phone: "9876543210", email: "rohit@example.com", bill: 4500, due: 2100, advance: 0, category: "Maintenance" },
  { flat: "B-204", resident: "Anita Verma", phone: "9876543211", email: "anita@example.com", bill: 2350, due: 0, advance: 500, category: "Electricity" },
  { flat: "C-301", resident: "Vikram Singh", phone: "9876543212", email: "vikram@example.com", bill: 1200, due: 0, advance: 0, category: "EV Charges" },
  { flat: "D-405", resident: "Neha Gupta", phone: "9876543213", email: "neha@example.com", bill: 5100, due: 0, advance: 0, category: "Maintenance" },
  { flat: "E-502", resident: "Arjun Patel", phone: "9876543214", email: "arjun@example.com", bill: 3000, due: 0, advance: 0, category: "Road Fund" },
  { flat: "F-601", resident: "Priya Mehta", phone: "9876543215", email: "priya@example.com", bill: 6800, due: 6800, advance: 0, category: "Electricity" },
];

const seedPayments = [
  { id: "PAY-1007", date: "31 Aug 2026, 12:21 PM", flat: "A-102", resident: "Rohit Sharma", category: "Maintenance", amount: 4500, mode: "UPI", status: "Success" },
  { id: "PAY-1006", date: "31 Aug 2026, 11:18 AM", flat: "B-204", resident: "Anita Verma", category: "Electricity", amount: 2350, mode: "UPI", status: "Success" },
  { id: "PAY-1005", date: "30 Aug 2026, 09:47 PM", flat: "C-301", resident: "Vikram Singh", category: "EV Charges", amount: 1200, mode: "Bank", status: "Success" },
  { id: "PAY-1004", date: "30 Aug 2026, 07:31 PM", flat: "D-405", resident: "Neha Gupta", category: "Maintenance", amount: 5100, mode: "Card", status: "Success" },
  { id: "PAY-1003", date: "29 Aug 2026, 06:05 PM", flat: "E-502", resident: "Arjun Patel", category: "Road Fund", amount: 3000, mode: "UPI", status: "Pending" },
];

// Fixed baseline figures the original dashboard displayed alongside live data.
// Kept here (instead of hardcoded in the UI) so the backend is the single source of truth.
const baselines = {
  collectionBase: 7647519,
  outstandingDisplay: 20078788,
  overdueBase: 286565,
  efficiency: "95.70%",
  categoryBreakdown: [
    { name: "Electricity", value: 2835000 },
    { name: "Maintenance", value: 2218000 },
    { name: "EV Charges", value: 926000 },
    { name: "Road Fund", value: 883000 },
    { name: "Others", value: 785000 },
  ],
  paymentModeBreakdown: [
    { name: "UPI", value: 3716000 },
    { name: "Bank Transfer", value: 2147000 },
    { name: "Card", value: 1085000 },
    { name: "Cash", value: 599000 },
    { name: "Others", value: 100000 },
  ],
};

function load() {
  if (fs.existsSync(DB_FILE)) {
    try {
      return JSON.parse(fs.readFileSync(DB_FILE, "utf-8"));
    } catch {
      // fall through to reseed if the file is corrupted
    }
  }
  return { residents: seedResidents, payments: seedPayments, bills: [] };
}

const db = load();

function persist() {
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
}

export const store = {
  get residents() {
    return db.residents;
  },
  get payments() {
    return db.payments;
  },
  get bills() {
    return db.bills;
  },
  baselines,
  save: persist,
  reset() {
    db.residents = JSON.parse(JSON.stringify(seedResidents));
    db.payments = JSON.parse(JSON.stringify(seedPayments));
    db.bills = [];
    persist();
  },
};
