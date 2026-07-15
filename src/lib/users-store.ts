import { promises as fs } from "fs";
import path from "path";
import bcrypt from "bcryptjs";

export type StoredUser = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  passwordHash: string;
  createdAt: string;
};

const DATA_DIR = path.join(process.cwd(), ".data");
const USERS_FILE = path.join(DATA_DIR, "users.json");

async function ensureFile() {
  await fs.mkdir(DATA_DIR, { recursive: true });
  try {
    await fs.access(USERS_FILE);
  } catch {
    const demoHash = await bcrypt.hash("selavie123", 10);
    const seed: StoredUser[] = [
      {
        id: "user-demo",
        name: "Cliente Selavie",
        email: "demo@selavie.com.br",
        phone: "11999999999",
        passwordHash: demoHash,
        createdAt: new Date().toISOString(),
      },
    ];
    await fs.writeFile(USERS_FILE, JSON.stringify(seed, null, 2), "utf8");
  }
}

export async function readUsers(): Promise<StoredUser[]> {
  await ensureFile();
  const raw = await fs.readFile(USERS_FILE, "utf8");
  return JSON.parse(raw) as StoredUser[];
}

export async function findUserByEmail(email: string) {
  const users = await readUsers();
  return users.find((u) => u.email.toLowerCase() === email.toLowerCase());
}

export async function createUser(input: {
  name: string;
  email: string;
  phone?: string;
  password: string;
}) {
  const users = await readUsers();
  if (users.some((u) => u.email.toLowerCase() === input.email.toLowerCase())) {
    throw new Error("E-mail já cadastrado");
  }

  const user: StoredUser = {
    id: `user_${Date.now()}`,
    name: input.name,
    email: input.email.toLowerCase(),
    phone: input.phone,
    passwordHash: await bcrypt.hash(input.password, 10),
    createdAt: new Date().toISOString(),
  };

  users.push(user);
  await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2), "utf8");
  return user;
}
