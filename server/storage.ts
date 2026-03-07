import { type User, type InsertUser, users, userData } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getUserData(userId: string): Promise<any>;
  saveUserData(userId: string, data: any): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async getUserData(userId: string): Promise<any> {
    const [row] = await db.select().from(userData).where(eq(userData.userId, userId));
    return row?.data || {};
  }

  async saveUserData(userId: string, data: any): Promise<void> {
    const [existing] = await db.select().from(userData).where(eq(userData.userId, userId));
    if (existing) {
      await db.update(userData).set({ data }).where(eq(userData.userId, userId));
    } else {
      await db.insert(userData).values({ userId, data });
    }
  }
}

export const storage = new DatabaseStorage();
