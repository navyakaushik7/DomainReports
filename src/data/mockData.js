// Mock master data — replace with live API responses (see src/utils/api.js)

export const MINISTRIES = [
  "Ministry of Electronics & IT",
  "Ministry of Home Affairs",
  "Ministry of Health & Family Welfare",
  "Ministry of Education",
  "Ministry of Finance",
  "Ministry of Agriculture",
  "Ministry of Railways",
  "Ministry of Defence",
];

export const STATES = [
  "Delhi", "Maharashtra", "Karnataka", "Tamil Nadu", "Punjab",
  "Uttar Pradesh", "West Bengal", "Gujarat", "Rajasthan", "Kerala",
];

export const DEPARTMENTS = [
  "Department of Digital Infrastructure",
  "Department of Public Grievances",
  "Department of Health Services",
  "Department of School Education",
  "Department of Revenue",
  "Department of Agricultural Research",
];

export const ORGANISATIONS = [
  "National Informatics Centre",
  "AIIMS New Delhi",
  "IIT Delhi",
  "State Bank of India",
  "Indian Railways Board",
  "Central Water Commission",
];

export const ORG_CATEGORIES = ["Central Govt", "State Govt", "PSU", "Autonomous Body", "Statutory Body"];

export const STATUSES = ["Active", "Pending", "Rejected", "Cancelled", "Transferred"];

const NAMES = [
  "Rohit Sharma", "Ananya Iyer", "Karan Mehta", "Priya Nair", "Sanjay Gupta",
  "Divya Reddy", "Arjun Singh", "Neha Kapoor", "Vikram Rao", "Sunita Joshi",
];

function seededRandom(seed) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

function pick(rand, arr) {
  return arr[Math.floor(rand() * arr.length)];
}

function randomDate(rand, start, end) {
  const t = start + rand() * (end - start);
  return new Date(t);
}

function formatDate(d) {
  return d.toISOString().slice(0, 10);
}

const rand = seededRandom(42);
const yearStart = new Date("2024-08-01").getTime();
const yearEnd = new Date("2026-08-01").getTime();

export const DOMAIN_ROWS = Array.from({ length: 187 }, (_, i) => {
  const ministry = pick(rand, MINISTRIES);
  const status = pick(rand, STATUSES);
  const activation = randomDate(rand, yearStart, yearEnd);
  const created = new Date(activation.getTime() - rand() * 1000 * 60 * 60 * 24 * 30);
  const updated = new Date(activation.getTime() + rand() * 1000 * 60 * 60 * 24 * 10);
  const org = pick(rand, ORGANISATIONS);
  const officer = pick(rand, NAMES);
  const slug = org.toLowerCase().replace(/[^a-z0-9]+/g, "");
  return {
    id: i + 1,
    domainName: `${slug}${i + 1}.gov.in`,
    ministry,
    state: pick(rand, STATES),
    department: pick(rand, DEPARTMENTS),
    organisation: org,
    orgCategory: pick(rand, ORG_CATEGORIES),
    nodalOfficer: officer,
    email: `${officer.toLowerCase().replace(/\s+/g, ".")}@${slug}.gov.in`,
    status,
    activationDate: formatDate(activation),
    createdDate: formatDate(created),
    lastUpdated: formatDate(updated),
  };
});

export function computeStats(rows) {
  const stats = {
    total: rows.length,
    active: 0,
    pending: 0,
    rejected: 0,
    cancelled: 0,
    transferred: 0,
  };
  for (const r of rows) {
    const key = r.status.toLowerCase();
    if (key in stats) stats[key] += 1;
  }
  return stats;
}

export function statusBreakdown(rows) {
  return STATUSES.map((s) => ({
    name: s,
    value: rows.filter((r) => r.status === s).length,
  }));
}

export function ministryBreakdown(rows) {
  return MINISTRIES.map((m) => ({
    name: m.replace("Ministry of ", ""),
    value: rows.filter((r) => r.ministry === m).length,
  })).sort((a, b) => b.value - a.value);
}

export function monthlyActivations(rows) {
  const buckets = {};
  for (const r of rows) {
    const key = r.activationDate.slice(0, 7);
    buckets[key] = (buckets[key] || 0) + 1;
  }
  return Object.entries(buckets)
    .sort(([a], [b]) => (a > b ? 1 : -1))
    .map(([month, value]) => ({ month, value }));
}

export function categoryBreakdown(rows) {
  return ORG_CATEGORIES.map((c) => ({
    name: c,
    value: rows.filter((r) => r.orgCategory === c).length,
  }));
}
