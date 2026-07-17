import { promises as fs } from "fs";
import path from "path";
import bcrypt from "bcryptjs";
import type {
  PublicUserProfile,
  SavedAddress,
  SavedPaymentMethod,
} from "@/types/profile";

export type StoredUser = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  cpf?: string;
  passwordHash: string;
  emailVerifiedAt: string | null;
  verificationCodeHash?: string;
  verificationCodeExpiresAt?: string;
  verificationCodeSentAt?: string;
  verificationAttempts?: number;
  addresses?: SavedAddress[];
  paymentMethods?: SavedPaymentMethod[];
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
        emailVerifiedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
      },
      {
        id: "user-henry",
        name: "Henry Maximo",
        email: "henrymaximo8@gmail.com",
        phone: "11993460533",
        passwordHash: demoHash,
        emailVerifiedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
      },
    ];
    await fs.writeFile(USERS_FILE, JSON.stringify(seed, null, 2), "utf8");
  }
}

export async function readUsers(): Promise<StoredUser[]> {
  await ensureFile();
  const raw = await fs.readFile(USERS_FILE, "utf8");
  const users = JSON.parse(raw) as Array<
    Omit<StoredUser, "emailVerifiedAt"> & { emailVerifiedAt?: string | null }
  >;
  let migrated = false;
  const normalized = users.map((user) => {
    if (user.emailVerifiedAt !== undefined) return user as StoredUser;
    migrated = true;
    return { ...user, emailVerifiedAt: user.createdAt };
  });

  if (migrated) {
    await writeUsers(normalized);
  }

  return normalized;
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
    emailVerifiedAt: null,
    createdAt: new Date().toISOString(),
  };

  users.push(user);
  await writeUsers(users);
  return user;
}

async function writeUsers(users: StoredUser[]) {
  await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2), "utf8");
}

export async function setVerificationCode(
  email: string,
  codeHash: string,
  expiresAt: Date,
) {
  const users = await readUsers();
  const user = users.find(
    (item) => item.email.toLowerCase() === email.toLowerCase(),
  );

  if (!user || user.emailVerifiedAt) return false;

  user.verificationCodeHash = codeHash;
  user.verificationCodeExpiresAt = expiresAt.toISOString();
  user.verificationCodeSentAt = new Date().toISOString();
  user.verificationAttempts = 0;
  await writeUsers(users);
  return true;
}

type VerifyCodeResult =
  | "verified"
  | "invalid"
  | "expired"
  | "too_many_attempts"
  | "already_verified";

export async function verifyEmailCode(
  email: string,
  codeHash: string,
): Promise<VerifyCodeResult> {
  const users = await readUsers();
  const user = users.find(
    (item) => item.email.toLowerCase() === email.toLowerCase(),
  );

  if (!user) return "invalid";
  if (user.emailVerifiedAt) return "already_verified";
  if (
    !user.verificationCodeHash ||
    !user.verificationCodeExpiresAt ||
    new Date(user.verificationCodeExpiresAt).getTime() < Date.now()
  ) {
    return "expired";
  }

  const attempts = user.verificationAttempts ?? 0;
  if (attempts >= 5) return "too_many_attempts";

  if (user.verificationCodeHash !== codeHash) {
    user.verificationAttempts = attempts + 1;
    await writeUsers(users);
    return user.verificationAttempts >= 5 ? "too_many_attempts" : "invalid";
  }

  user.emailVerifiedAt = new Date().toISOString();
  delete user.verificationCodeHash;
  delete user.verificationCodeExpiresAt;
  delete user.verificationCodeSentAt;
  delete user.verificationAttempts;
  await writeUsers(users);
  return "verified";
}

export async function deleteUnverifiedUser(email: string) {
  const users = await readUsers();
  const filtered = users.filter(
    (user) =>
      user.email.toLowerCase() !== email.toLowerCase() || user.emailVerifiedAt,
  );

  if (filtered.length !== users.length) {
    await writeUsers(filtered);
  }
}

export async function ensureVerifiedUser(input: {
  id?: string;
  name: string;
  email: string;
  phone?: string;
  password: string;
}) {
  const users = await readUsers();
  const existing = users.find(
    (user) => user.email.toLowerCase() === input.email.toLowerCase(),
  );

  if (existing) {
    existing.name = input.name;
    existing.phone = input.phone;
    existing.passwordHash = await bcrypt.hash(input.password, 10);
    existing.emailVerifiedAt = existing.emailVerifiedAt || new Date().toISOString();
    delete existing.verificationCodeHash;
    delete existing.verificationCodeExpiresAt;
    delete existing.verificationCodeSentAt;
    delete existing.verificationAttempts;
    await writeUsers(users);
    return existing;
  }

  const user: StoredUser = {
    id: input.id || `user_${Date.now()}`,
    name: input.name,
    email: input.email.toLowerCase(),
    phone: input.phone,
    passwordHash: await bcrypt.hash(input.password, 10),
    emailVerifiedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  };

  users.push(user);
  await writeUsers(users);
  return user;
}

export async function findUserById(id: string) {
  const users = await readUsers();
  return users.find((user) => user.id === id);
}

export function toPublicProfile(user: StoredUser): PublicUserProfile {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    cpf: user.cpf,
    addresses: user.addresses || [],
    paymentMethods: user.paymentMethods || [],
  };
}

export async function updateUserProfile(
  userId: string,
  patch: Partial<
    Pick<StoredUser, "name" | "phone" | "cpf" | "addresses" | "paymentMethods">
  >,
) {
  const users = await readUsers();
  const index = users.findIndex((user) => user.id === userId);
  if (index === -1) return null;

  users[index] = {
    ...users[index],
    ...patch,
  };
  await writeUsers(users);
  return toPublicProfile(users[index]);
}

export async function addUserAddress(
  userId: string,
  address: Omit<SavedAddress, "id">,
) {
  const users = await readUsers();
  const user = users.find((item) => item.id === userId);
  if (!user) return null;

  const addresses = [...(user.addresses || [])];
  const next: SavedAddress = {
    ...address,
    id: `addr_${Date.now()}`,
    isDefault: address.isDefault || addresses.length === 0,
  };

  if (next.isDefault) {
    for (const item of addresses) item.isDefault = false;
  }

  addresses.push(next);
  user.addresses = addresses;
  await writeUsers(users);
  return toPublicProfile(user);
}

export async function removeUserAddress(userId: string, addressId: string) {
  const users = await readUsers();
  const user = users.find((item) => item.id === userId);
  if (!user) return null;

  const addresses = (user.addresses || []).filter((item) => item.id !== addressId);
  if (addresses.length && !addresses.some((item) => item.isDefault)) {
    addresses[0].isDefault = true;
  }
  user.addresses = addresses;
  await writeUsers(users);
  return toPublicProfile(user);
}

export async function setDefaultUserAddress(userId: string, addressId: string) {
  const users = await readUsers();
  const user = users.find((item) => item.id === userId);
  if (!user?.addresses?.some((item) => item.id === addressId)) return null;

  user.addresses = user.addresses.map((item) => ({
    ...item,
    isDefault: item.id === addressId,
  }));
  await writeUsers(users);
  return toPublicProfile(user);
}

export async function addUserPaymentMethod(
  userId: string,
  method: Omit<SavedPaymentMethod, "id">,
) {
  const users = await readUsers();
  const user = users.find((item) => item.id === userId);
  if (!user) return null;

  const methods = [...(user.paymentMethods || [])];
  const next: SavedPaymentMethod = {
    ...method,
    id: `pay_${Date.now()}`,
    isDefault: method.isDefault || methods.length === 0,
  };

  if (next.isDefault) {
    for (const item of methods) item.isDefault = false;
  }

  methods.push(next);
  user.paymentMethods = methods;
  await writeUsers(users);
  return toPublicProfile(user);
}

export async function removeUserPaymentMethod(
  userId: string,
  methodId: string,
) {
  const users = await readUsers();
  const user = users.find((item) => item.id === userId);
  if (!user) return null;

  const methods = (user.paymentMethods || []).filter(
    (item) => item.id !== methodId,
  );
  if (methods.length && !methods.some((item) => item.isDefault)) {
    methods[0].isDefault = true;
  }
  user.paymentMethods = methods;
  await writeUsers(users);
  return toPublicProfile(user);
}

export async function setDefaultUserPaymentMethod(
  userId: string,
  methodId: string,
) {
  const users = await readUsers();
  const user = users.find((item) => item.id === userId);
  if (!user?.paymentMethods?.some((item) => item.id === methodId)) return null;

  user.paymentMethods = user.paymentMethods.map((item) => ({
    ...item,
    isDefault: item.id === methodId,
  }));
  await writeUsers(users);
  return toPublicProfile(user);
}
