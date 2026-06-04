import type { EmployeeRow, EmployeeStatus } from "@/types/table";

const FIRST_NAMES = [
  "Aarav", "Olivia", "Liam", "Emma", "Noah", "Ava", "Ethan", "Sophia", "Mason",
  "Isabella", "Lucas", "Mia", "Arjun", "Priya", "Diego", "Chloe", "Yuki", "Hana",
  "Omar", "Layla", "Nikhil", "Sara", "Ben", "Zoe", "Ravi", "Maya", "Leo", "Nina",
];

const LAST_NAMES = [
  "Sharma", "Smith", "Johnson", "Patel", "Garcia", "Kim", "Nguyen", "Brown",
  "Muller", "Rossi", "Silva", "Khan", "Ivanov", "Tanaka", "Okafor", "Cohen",
  "Reddy", "Lopez", "Andersson", "Costa", "Verma", "Wang", "Singh", "Dubois",
];

const DEPARTMENTS = [
  "Engineering", "Sales", "Marketing", "Finance", "Operations",
  "Human Resources", "Customer Success", "Legal", "Design", "Product",
];

export const STATUSES: readonly EmployeeStatus[] = [
  "Active", "Inactive", "Pending", "On Leave",
];

// Seeded RNG (mulberry32) so the generated rows are the same on every reload.
function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function pick<T>(rand: () => number, arr: readonly T[]): T {
  return arr[Math.floor(rand() * arr.length)];
}

export function generateEmployees(count = 10_000, seed = 42): EmployeeRow[] {
  const rand = mulberry32(seed);
  const rows: EmployeeRow[] = new Array(count);

  for (let i = 0; i < count; i++) {
    const first = pick(rand, FIRST_NAMES);
    const last = pick(rand, LAST_NAMES);
    const id = i + 1;

    const daysAgo = Math.floor(rand() * 2920);
    const joined = new Date();
    joined.setDate(joined.getDate() - daysAgo);

    rows[i] = {
      id,
      name: `${first} ${last}`,
      email: `${first}.${last}${id}`.toLowerCase() + "@example.com",
      department: pick(rand, DEPARTMENTS),
      salary: 40_000 + Math.floor(rand() * 180_000),
      status: pick(rand, STATUSES),
      joinedAt: joined.toISOString().slice(0, 10),
    };
  }

  return rows;
}

export const DEPARTMENT_OPTIONS = DEPARTMENTS;
